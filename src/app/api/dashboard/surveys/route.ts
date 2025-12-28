import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import { createSurveySchema } from "@/lib/validation/validation";
import { getAllSurveys, createSurvey } from "@/lib/queries/surveys";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createSurveySchema.parse(body);

    // Check if user is ADMIN
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can create surveys" },
        { status: 403 }
      );
    }

    // Validation: if not global, must have at least one team
    if (
      !validatedData.isGlobal &&
      (!validatedData.teamIds || validatedData.teamIds.length === 0)
    ) {
      return NextResponse.json(
        { error: "Please select at least one team or make the survey global" },
        { status: 400 }
      );
    }

    // Convert string dates to Date objects if provided
    const startDate = validatedData.startDate
      ? new Date(validatedData.startDate)
      : undefined;
    const endDate = validatedData.endDate
      ? new Date(validatedData.endDate)
      : undefined;

    // Create the survey using query function
    const survey = await createSurvey(session.user.companyId, {
      title: validatedData.title,
      description: validatedData.description,
      isGlobal: validatedData.isGlobal,
      startDate,
      endDate,
      teamIds: validatedData.teamIds,
    });

    return NextResponse.json({
      success: true,
      survey,
    });
  } catch (error) {
    console.error("Error creating survey:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create survey" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all surveys query function
    const surveys = await getAllSurveys(session.user.companyId);

    return NextResponse.json({ surveys });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      { error: "Failed to fetch surveys" },
      { status: 500 }
    );
  }
}
