// Standalone Server Configuration template
// Useful when linking external Express/Fastify node servers to the Next.js frontend boilerplate

export const serverConfig = {
  port: process.env.PORT || 4000,
  env: process.env.NODE_ENV || "development",
  
  // Auth configurations
  auth: {
    otpExpiryMinutes: 5,
    maxAttempts: 3,
    sessionExpiryHours: 24,
  },
  
  // Direct integrations mapping
  integrations: {
    sms: {
      provider: "twilio",
      sid: process.env.TWILIO_ACCOUNT_SID || "",
      token: process.env.TWILIO_AUTH_TOKEN || "",
      phone: process.env.TWILIO_PHONE_NUMBER || "",
    },
    email: {
      provider: "nodemailer",
      smtp: {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
      resendKey: process.env.RESEND_API_KEY || "",
    },
    maps: {
      provider: "openstreetmap-nominatim",
      userAgent: "StandaloneExpressServer/1.0",
    }
  }
};

export default serverConfig;
