import { getSession } from "@/lib/session/session";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTeamSchema } from "@/lib/validation/validation";
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

    // Create the team
    const team = await prisma.team.create({
      data: {
        name: validatedData.name,
        companyId: session.user.companyId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

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

    let teams;

    if (session.user.role === "ADMIN") {
      // Admin: Fetch all teams in the company
      teams = await prisma.team.findMany({
        where: {
          companyId: session.user.companyId,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          members: {
            select: {
              id: true,
              role: true,
              joinedAt: true,
              leftAt: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      // Non-admin: Fetch only teams the user is a member of
      teams = await prisma.team.findMany({
        where: {
          companyId: session.user.companyId,
          deletedAt: null,
          members: {
            some: {
              userId: session.user.id,
              leftAt: null, // Only active memberships
            },
          },
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          members: {
            where: {
              leftAt: null, // Only active members
            },
            select: {
              id: true,
              role: true,
              joinedAt: true,
              leftAt: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // Map teams to include member count
    const teamsWithMemberCount = teams.map((team) => ({
      ...team,
      memberCount: team.members.length,
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
