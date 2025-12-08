import { getSession } from "@/lib/session/session";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await getSession();
    // Clears the session data
    session.destroy();

    return NextResponse.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
