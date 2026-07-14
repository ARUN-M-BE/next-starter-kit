import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/server/auth";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("session_token")?.value;
    if (token) {
      await deleteSession(token);
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    
    // Clear session token cookie
    response.cookies.delete("session_token");

    return response;
  } catch (error) {
    console.error("Logout Route Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
