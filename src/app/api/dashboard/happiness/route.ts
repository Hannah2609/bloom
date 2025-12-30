import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import {
  hasUserSubmittedThisWeek,
  submitHappinessScore,
} from "@/lib/queries/happiness";

// Check if user has submitted this week
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasSubmitted = await hasUserSubmittedThisWeek(session.user.id);

    return NextResponse.json({ 
      hasSubmitted,
    });
  } catch (error) {
    console.error("Error checking happiness status:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}

// Submit happiness score
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { score } = await req.json();
    
    // Validate score (0.5-5.0)
    if (!score || typeof score !== "number" || score < 0.5 || score > 5.0) {
      return NextResponse.json(
        { error: "Score must be between 0.5 and 5.0" },
        { status: 400 }
      );
    }

    await submitHappinessScore(
      session.user.id,
      session.user.companyId,
      score
    );

    return NextResponse.json({ 
      success: true,
    });
  } catch (error) {
    console.error("Error submitting happiness score:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit score" },
      { status: 500 }
    );
  }
}

