export default {
  routes: [
    {
      method: 'POST',
      path: '/chat',
      handler: 'chat.handleChat',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};