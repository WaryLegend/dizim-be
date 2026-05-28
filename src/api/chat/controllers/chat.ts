import { GoogleGenAI } from '@google/genai'; 

// Khởi tạo SDK bằng Client mới
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Hàm thuần toán học tính Cosine Similarity giữa 2 mảng số thực (Vector)
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export default {
  async handleChat(ctx) {
    try {
      console.log('=== handleChat called ===');
      // Lấy dữ liệu payload từ Frontend gửi lên
      const { message, mode, session_id } = ctx.request.body;
      console.log('Body:', { message, mode, session_id });

      if (!message || !mode) {
        return ctx.badRequest('Thiếu tham số message hoặc mode!');
      }

      // Embedding câu hỏi người dùng bằng model embedding
      const embeddingResult = await ai.models.embedContent({
        model: 'gemini-embedding-001', 
        contents: message,
      });
      const userVector = embeddingResult.embeddings[0].values; 
      // ----------------------------------------------------

      // Lấy tất cả tài liệu RAG từ MySQL thuộc nhóm 'category' tương ứng
      console.log('Step 2: query MySQL, mode =', mode);
      const rawRecords = await strapi.db.connection.raw(`
        SELECT id, title, content, category, embedding 
        FROM bot_knowledges 
        WHERE category = ?
      `, [mode]);

      const records = rawRecords[0] || rawRecords;
      console.log('Records found:', records.length); // ← checkpoint
      console.log('Has embedding:', records.map(r => ({ id: r.id, emb: !!r.embedding })));

      // Duyệt qua danh sách tài liệu, tính điểm tương đồng ngữ nghĩa
      const scoredRecords = [];
      for (const row of records) {
        if (!row.embedding) continue;
        const docVector = typeof row.embedding === 'string' ? JSON.parse(row.embedding) : row.embedding;
        const score = cosineSimilarity(userVector, docVector);
        scoredRecords.push({ ...row, score });
      }

      // Sắp xếp giảm dần theo điểm số tương đồng và lấy ra tối đa 3 đoạn tài liệu khớp nhất
      const topMatches = scoredRecords
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      // Gộp nội dung các đoạn tài liệu lại làm ngữ cảnh (Context)
      const contextText = topMatches.map(match => `- ${match.title}: ${match.content}`).join('\n');

      // Đọc cấu hình Prompt động từ Single Type 'chatbox-setting'
      const botSetting = await strapi.documents('api::chat-box-setting.chat-box-setting').findFirst();
      
      if (!botSetting) {
        return ctx.internalServerError('Chưa cấu hình chat-box-setting trên Strapi UI!');
      }

      const baseInstruction = mode === 'gioi_thieu' ? botSetting.instruction_product : botSetting.instruction_support;
      const systemConstraints = botSetting.system_constraints;

      const finalSystemPrompt = `
        ${baseInstruction}
        
        [RÀNG BUỘC HỆ THỐNG]
        ${systemConstraints}
        
        [CONTEXT / TÀI LIỆU ĐÍNH KÈM]
        ${contextText ? contextText : "Không có tài liệu nội bộ nào khớp với câu hỏi này."}
      `;

      // Xử lý phiên chat: Tìm kiếm session hiện tại, nếu có thì lấy lịch sử hội thoại, nếu không thì tạo mới
      let sessionDocId = null;
      let currentSessionId = session_id;
      let historyContents = [];

      if (currentSessionId) {
        const session = await strapi.documents('api::chat-session.chat-session').findFirst({
          filters: { id: currentSessionId }
        });
        if (session) {
          sessionDocId = session.documentId;

          const pastChats = await strapi.documents('api::chat-history.chat-history').findMany({
            filters: { chat_session: { documentId: sessionDocId } },
            sort: 'createdAt:asc',
            limit: 5
          });

          // Chuẩn hóa mảng lịch sử theo đúng quy định cặp hội thoại của SDK mới
          for (const chat of pastChats) {
            historyContents.push({ role: 'user', parts: [{ text: chat.user_message }] });
            historyContents.push({ role: 'model', parts: [{ text: chat.bot_response }] });
          }
        }
      } else {
        const newSession = await strapi.documents('api::chat-session.chat-session').create({
          data: {
            session_name: message.slice(0, 20) + '...',
          }
        });
        sessionDocId = newSession.documentId;
        currentSessionId = newSession.id;
      }

      // Đẩy câu hỏi hiện tại vào cuối mảng hội thoại
      historyContents.push({ role: 'user', parts: [{ text: message }] });

      // Generate response từ Gemini 1.5 Flash với cấu hình mới nhất
      const responseResult = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: historyContents,
        config: {
          systemInstruction: finalSystemPrompt, // Đưa gọn gàng vào trong object config theo chuẩn mới
        }
      });

      const botResponse = responseResult.text; // SDK mới cho phép lấy text cực gọn trực tiếp từ kết quả

      // Lưu vết lịch sử vào bảng 'chat-history' 
      await strapi.documents('api::chat-history.chat-history').create({
        data: {
          user_message: message,
          bot_response: botResponse,
          // SDK mới trả trực tiếp object usageMetadata ở gốc responseResult giúp bốc dữ liệu token rất nhàn
          prompt_tokens: responseResult.usageMetadata?.promptTokenCount || 0,
          completion_tokens: responseResult.usageMetadata?.candidatesTokenCount || 0,
          chat_session: sessionDocId ? sessionDocId : null
        }
      });

      // Trả dữ liệu sạch về cho Frontend Next.js hiển thị
      return ctx.send({
        reply: botResponse,
        mode: mode,
        session_id: currentSessionId
      });

    } catch (error) {
      strapi.log.error('Lỗi xử lý tại Custom Chat API:', error);
      return ctx.internalServerError('Hệ thống xử lý AI đang gặp sự cố, vui lòng thử lại sau.');
    }
  }
};