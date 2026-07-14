import { NextRequest, NextResponse } from "next/server";
import { sendSMS } from "@/server/sms";
import { z } from "zod";

const smsRequestSchema = z.object({
  to: z.string().min(10).max(15),
  body: z.string().min(1).max(160),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = smsRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { to, body: message } = validation.data;
    await sendSMS({ to, body: message });

    return NextResponse.json({ success: true, message: "SMS sent successfully" });
  } catch (error) {
    console.error("SMS API Route Error:", error);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}
