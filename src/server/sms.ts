import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

interface SendSMSParams {
  to: string;
  body: string;
}

/**
 * Sends SMS using Twilio.
 * Falls back to console log in development if Twilio credentials are missing.
 */
export async function sendSMS({ to, body }: SendSMSParams) {
  if (!client || !twilioPhone) {
    console.log("=========================================");
    console.log(`[DEV MODE] Sending SMS:`);
    console.log(`To: ${to}`);
    console.log(`Message: ${body}`);
    console.log("=========================================");
    return { success: true, message: "Dev mode: SMS logged to console" };
  }

  try {
    const message = await client.messages.create({
      body: body,
      from: twilioPhone,
      to: to,
    });
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error("SMS sending failed:", error);
    throw error;
  }
}
