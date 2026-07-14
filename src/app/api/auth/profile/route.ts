import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateSession } from "@/server/auth";
import { profileSchema } from "@/lib/validations";

// Helper to extract session token from cookies or authorization header
function getSessionToken(request: NextRequest): string | null {
  const cookieToken = request.cookies.get("session_token")?.value;
  if (cookieToken) return cookieToken;

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const token = getSessionToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Missing session token" }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Invalid or expired session" }, { status: 401 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Profile GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getSessionToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Missing session token" }, { status: 401 });
    }

    const sessionUser = await validateSession(token);
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized: Invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const validation = profileSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const updatedData = validation.data;

    // Update user profile details and mark profile setup complete
    const updatedUser = await prisma.user.update({
      where: { id: sessionUser.id },
      data: {
        name: updatedData.name,
        email: updatedData.email,
        bio: updatedData.bio,
        address: updatedData.address,
        city: updatedData.city,
        state: updatedData.state,
        country: updatedData.country,
        zipCode: updatedData.zipCode,
        avatar: updatedData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(updatedData.name)}`,
        isProfileComplete: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
