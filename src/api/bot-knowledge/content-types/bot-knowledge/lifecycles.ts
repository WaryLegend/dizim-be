import { GoogleGenAI } from '@google/genai';

// Khởi tạo SDK bằng Client mới đồng bộ với file Chat Controller
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function extractTextFromBlocks(content: any): string {
  if (!content) return '';
  
  // Nếu đã là string thuần thì trả về luôn
  if (typeof content === 'string') return content;
  
  // Nếu là Blocks JSON array thì extract text
  if (Array.isArray(content)) {
    return content
      .map(block => {
        if (block.children && Array.isArray(block.children)) {
          return block.children
            .map(child => child.text || '')
            .join('');
        }
        return '';
      })
      .join('\n')
      .trim();
  }
  
  return '';
}

// Hàm dùng chung để xử lý sinh và cập nhật Vector Embedding vào MySQL
async function updateVectorEmbedding(result: any) {
  // Nếu không có nội dung chữ hoặc nội dung trống thì không cần xử lý
  if (!result || !result.content) return;

  try {
    // Embedding nội dung bản ghi bằng model embedding của Google GenAI
    const plainText = extractTextFromBlocks(result.content); 
    
    if (!plainText) return; 
    
    const embeddingResult = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: plainText, 
    });

    // Bốc tách phần tử đầu tiên từ mảng embeddings (Sửa triệt để lỗi ts(2551))
    const vectorValues = embeddingResult.embeddings[0].values;

    // Chuyển mảng số thành chuỗi định dạng JSON String để lưu vào cột JSON MySQL
    const jsonVector = JSON.stringify(vectorValues);

    // Bắn lệnh SQL cập nhật thẳng vào cột embedding trong MySQL dựa trên ID
    await strapi.db.connection.raw(`
      UPDATE bot_knowledges 
      SET embedding = ? 
      WHERE id = ?
    `, [jsonVector, result.id]);

    strapi.log.info(`[Auto-RAG Lifecycles] Đồng bộ JSON Embedding thành công cho ID: ${result.id}`);

  } catch (error) {
    strapi.log.error(`[Auto-RAG Lifecycles] Lỗi sinh Vector cho tài liệu ID ${result.id}:`, error);
  }
}

export default {
  // Tự động kích hoạt ngay sau khi thêm mới một bản ghi Bot Knowledge
  async afterCreate(event) {
    const { result } = event;
    setTimeout(() =>  updateVectorEmbedding(result), 5000); // Thêm timeout 5 giây để đảm bảo dữ liệu đã được commit vào MySQL trước khi truy vấn lại
  },

  // Tự động kích hoạt ngay sau khi Admin chỉnh sửa nội dung bản ghi cũ
  async afterUpdate(event) {
    const { result } = event;
    setTimeout(() =>  updateVectorEmbedding(result), 5000); // Thêm timeout 5 giây để đảm bảo dữ liệu đã được commit vào MySQL trước khi truy vấn lại
  }
};