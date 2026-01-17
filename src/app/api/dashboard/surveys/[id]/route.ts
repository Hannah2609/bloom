import { getSession } from "@/lib/session/session";
import { NextResponse } from "next/server";
import { deleteSurvey } from "@/lib/queries/surveys";

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
