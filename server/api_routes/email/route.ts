import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/server/email";
import { contactFormSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = contactFormSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validation.data;

    const emailContent = `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `;

    // Trigger SMTP/Resend helper
    await sendEmail({
      to: process.env.SMTP_USER || "admin@example.com",
      subject: `[Contact Form] ${subject}`,
      html: emailContent,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`,
    });

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email send route error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
