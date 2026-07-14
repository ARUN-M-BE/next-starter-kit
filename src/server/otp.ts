import prisma from "@/lib/prisma";
import { OTP_EXPIRY_MINUTES, MAX_OTP_ATTEMPTS } from "@/lib/constants";

/**
 * Generates a random 6-digit OTP code, stores it in database, and sets expiration.
 */
export async function generateOTP(phone: string): Promise<string> {
  // Generate a random 6-digit numeric string
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Deactivate any existing active OTP codes for this number
  await prisma.oTP.deleteMany({
    where: {
      phone: phone,
      verified: false,
    },
  });

  // Save new code to DB
  await prisma.oTP.create({
    data: {
      phone,
      code,
      expiresAt,
    },
  });

  return code;
}

/**
 * Verifies the OTP code for a phone number.
 * Returns true if valid, false if invalid or expired.
 */
export async function verifyOTP(phone: string, code: string): Promise<boolean> {
  const otpRecord = await prisma.oTP.findFirst({
    where: {
      phone: phone,
      verified: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpRecord) return false;

  // Check expiration
  if (new Date() > otpRecord.expiresAt) {
    await prisma.oTP.delete({ where: { id: otpRecord.id } });
    return false;
  }

  // Max attempts validation
  if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
    await prisma.oTP.delete({ where: { id: otpRecord.id } });
    return false;
  }

  // Verify match
  if (otpRecord.code !== code) {
    await prisma.oTP.update({
      where: { id: otpRecord.id },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });
    return false;
  }

  // Success
  await prisma.oTP.update({
    where: { id: otpRecord.id },
    data: { verified: true },
  });

  return true;
}

/**
 * Removes expired OTP records from SQLite database to save disk space.
 */
export async function cleanupExpiredOTPs() {
  await prisma.oTP.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}
