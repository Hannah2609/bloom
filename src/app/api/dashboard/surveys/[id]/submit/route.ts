import { NextRequest, NextResponse } from "next/server";
import { submitSurveyResponse } from "@/lib/queries/responses";
import { getSession } from "@/lib/session/session";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate answers format
    for (const answer of answers) {
      if (
        !answer.questionId ||
        typeof answer.ratingValue !== "number" ||
        answer.ratingValue < 1 ||
        answer.ratingValue > 5
      ) {
        return NextResponse.json(
          { message: "Invalid answer format" },
          { status: 400 }
        );
      }
    }

    const response = await submitSurveyResponse({
      surveyId: id,
      userId: session.user.id,
      companyId: session.user.companyId,
      answers,
    });

    return NextResponse.json({ response }, { status: 201 });
  } catch (error) {
    console.error("Error submitting survey:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to submit survey",
      },
      { status: 500 }
    );
  }
}
