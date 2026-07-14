import nodemailer from "nodemailer";
import { Resend } from "resend";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Sends email using Nodemailer SMTP configuration.
 * Falls back to console log in development if no SMTP user is provided.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  const from = process.env.SMTP_FROM || "noreply@yourdomain.com";

  if (!process.env.SMTP_USER && !process.env.RESEND_API_KEY) {
    console.log("=========================================");
    console.log(`[DEV MODE] Sending Email:`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text || html.replace(/<[^>]*>/g, "")}`);
    console.log("=========================================");
    return { success: true, message: "Dev mode: Email logged to console" };
  }

  try {
    if (resend) {
      const response = await resend.emails.send({
        from: from,
        to: [to],
        subject: subject,
        html: html,
      });
      return { success: true, messageId: response.data?.id };
    } else {
      const info = await transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        html: html,
        text: text || html.replace(/<[^>]*>/g, ""),
      });
      return { success: true, messageId: info.messageId };
    }
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}
