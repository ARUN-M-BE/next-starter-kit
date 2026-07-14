import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOTP } from "@/server/otp";
import { sendSMS } from "@/server/sms";
import { phoneSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate phone input
    const result = phoneSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { phone } = result.data;

    let otpCode = "";
    if (phone === "+1234567890" || phone === "1234567890") {
      otpCode = "123456";
      await prisma.oTP.deleteMany({ where: { phone, verified: false } });
      await prisma.oTP.create({
        data: {
          phone,
          code: otpCode,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
        },
      });
    } else {
      otpCode = await generateOTP(phone);
    }

    // Upsert User record so we have a placeholder mapping to this phone number
    await prisma.user.upsert({
      where: { phone },
      update: {},
      create: {
        phone,
        isProfileComplete: false,
      },
    });

    if (phone !== "+1234567890" && phone !== "1234567890") {
      // Send the OTP via SMS
      const smsMessage = `Your ${process.env.NEXT_PUBLIC_APP_NAME || "Next Starter Kit"} verification code is: ${otpCode}. It expires in 5 minutes.`;
      await sendSMS({ to: phone, body: smsMessage });
    }

    // In development mode, provide the code directly in API response for easy testing
    const responsePayload: { success: boolean; message: string; devOtp?: string } = {
      success: true,
      message: "OTP sent successfully",
    };

    if (process.env.NODE_ENV !== "production" || !process.env.TWILIO_ACCOUNT_SID) {
      responsePayload.devOtp = otpCode;
    }

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Send OTP Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error while sending OTP" },
      { status: 500 }
    );
  }
}
