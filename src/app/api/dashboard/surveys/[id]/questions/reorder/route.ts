import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import { reorderQuestions } from "@/lib/queries/surveys";
import { reorderQuestionsSchema } from "@/lib/validation/validation";

export async function PATCH(
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
        { error: "Only admins can reorder questions" },
        { status: 403 }
      );
    }

    const surveyId = (await params).id;
    const body = await req.json();
    const validatedData = reorderQuestionsSchema.parse(body);

    await reorderQuestions(
      surveyId,
      validatedData.questionOrders,
      session.user.companyId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering questions:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to reorder questions" },
      { status: 500 }
    );
  }
}
