import { randomUUID } from "crypto";
import prisma from "@/lib/prisma";
import { SESSION_EXPIRY_HOURS } from "@/lib/constants";
import { User } from "@/types";

/**
 * Creates an active session in the database for the given userId.
 * Returns the unique token.
 */
export async function createSession(userId: string): Promise<string> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

/**
 * Validates a session token. Returns User object if valid, null otherwise.
 */
export async function validateSession(token: string): Promise<User | null> {
  if (!token) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });

    if (!session) return null;

    // Check expiration
    if (new Date() > session.expiresAt) {
      await prisma.session.delete({ where: { id: session.id } });
      return null;
    }

    return session.user as unknown as User;
  } catch (error) {
    console.error("Session validation error:", error);
    return null;
  }
}

/**
 * Destroys a session token by deleting it from database.
 */
export async function deleteSession(token: string): Promise<void> {
  if (!token) return;
  try {
    await prisma.session.deleteMany({
      where: { token },
    });
  } catch (error) {
    console.error("Session delete error:", error);
  }
}
