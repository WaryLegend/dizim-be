export default ({ env }) => ({
  "users-permissions": {
    config: {
      register: {
        allowedFields: ["phone", "usertype"],
      },
    },
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('EMAIL_SMTP_HOST', 'smtp.gmail.com'),
        port: env.int('EMAIL_SMTP_PORT', 587),
        secure: false,
        auth: {
          user: env('EMAIL_SMTP_USERNAME'),
          pass: env('EMAIL_SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('EMAIL_SMTP_USERNAME'),
        defaultReplyTo: env('EMAIL_SMTP_USERNAME'),
      },
    },
  },
});