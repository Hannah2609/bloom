import { getSession } from "@/lib/session/session";
import { NextResponse } from "next/server";
import { deleteSurvey, updateSurvey } from "@/lib/queries/surveys";
import { editSurveySchema } from "@/lib/validation/validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id: surveyId } = await params;
    const body = await request.json();

    // Validate request body
    const validatedData = editSurveySchema.parse(body);

    // Convert date strings to Date objects
    const updateData = {
      title: validatedData.title,
      description: validatedData.description,
      isGlobal: validatedData.isGlobal,
      teamIds: validatedData.teamIds,
      startDate: validatedData.startDate
        ? new Date(validatedData.startDate)
        : undefined,
      endDate: validatedData.endDate
        ? new Date(validatedData.endDate)
        : undefined,
    };

    const updatedSurvey = await updateSurvey(
      surveyId,
      session.user.companyId,
      updateData
    );

    return NextResponse.json(
      { survey: updatedSurvey, message: "Survey updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating survey:", error);

    if (error instanceof Error) {
      if (error.message === "Survey not found") {
        return NextResponse.json(
          { error: "Survey not found" },
          { status: 404 }
        );
      }
      if (error.message.includes("Cannot edit survey")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete survey with soft delete
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id: surveyId } = await params;

    await deleteSurvey(surveyId, session.user.companyId);

    return NextResponse.json(
      { message: "Survey deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting survey:", error);

    if (error instanceof Error) {
      if (error.message === "Survey not found") {
        return NextResponse.json(
          { error: "Survey not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
