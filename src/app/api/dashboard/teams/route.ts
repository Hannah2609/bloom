import { getSession } from "@/lib/session/session";
import { NextResponse } from "next/server";
import { createTeamSchema } from "@/lib/validation/validation";
import { getAllTeams, getUserTeams, createTeam } from "@/lib/queries/teams";
import { z } from "zod";

// Create a new team (admin access)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body
    const validatedData = createTeamSchema.parse(body);

    const session = await getSession();

    // Check if user is logged in and is admin
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Create the team using query function
    const team = await createTeam(session.user.companyId, validatedData.name);

    return NextResponse.json(
      {
        message: "Team created successfully",
        team,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating team:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Get teams - all teams for admin, user's teams for non-admin
export async function GET() {
  try {
    const session = await getSession();

    // Check if user is logged in
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use query functions based on user role
    let teams;
    if (session.user.role === "ADMIN") {
      teams = await getAllTeams(session.user.companyId);
    } else {
      teams = await getUserTeams(session.user.companyId, session.user.id);
    }

    // Map teams to include member count (already included in query functions)
    const teamsWithMemberCount = teams.map((team) => ({
      id: team.id,
      name: team.name,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      memberCount: team.memberCount,
    }));

    return NextResponse.json({ teams: teamsWithMemberCount });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
