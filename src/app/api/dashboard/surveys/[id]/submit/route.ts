import { getSession } from "@/lib/session/session";
import { submitSurveyResponse } from "@/lib/queries/responses";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const { id: surveyId } = await params;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Block admin submissions
    if (session.user.role === "ADMIN") {
      return NextResponse.json(
        {
          error:
            "Admins cannot submit survey responses. You can preview surveys but not submit answers.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const response = await submitSurveyResponse({
      surveyId,
      userId: session.user.id,
      companyId: session.user.companyId,
      answers,
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("Error submitting survey:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to submit survey",
      },
      { status: 500 }
    );
  }
}
