import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import {
  createQuestion,
  getQuestionsBySurveyId,
  updateQuestion,
} from "@/lib/queries/surveys";
import {
  updateQuestionSchema,
  createQuestionSchema,
} from "@/lib/validation/validation";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can create questions" },
        { status: 403 }
      );
    }

    const surveyId = (await params).id;
    const body = await req.json();
    const validatedData = createQuestionSchema.parse(body);

    // Create question query function
    const question = await createQuestion(
      surveyId,
      validatedData,
      session.user.companyId
    );

    return NextResponse.json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("Error creating question:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const surveyId = (await params).id;

    // Get questions by survey ID query function
    const questions = await getQuestionsBySurveyId(
      surveyId,
      session.user.companyId
    );

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can update questions" },
        { status: 403 }
      );
    }

    const surveyId = (await params).id;
    const body = await req.json();
    const validatedData = updateQuestionSchema.parse(body);
    const questionId = validatedData.questionId;

    // Update question query function
    const question = await updateQuestion(
      questionId,
      surveyId,
      validatedData,
      session.user.companyId
    );

    return NextResponse.json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("Error updating question:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}
