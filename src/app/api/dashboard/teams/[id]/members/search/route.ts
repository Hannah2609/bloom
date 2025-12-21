import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session/session";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId } = await params;
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    // Verify team exists and belongs to company
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        companyId: session.user.companyId,
        deletedAt: null,
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Get existing member IDs to exclude them
    const existingMembers = await prisma.teamMember.findMany({
      where: {
        teamId,
        leftAt: null,
      },
      select: { userId: true },
    });
    const existingUserIds = existingMembers.map((m) => m.userId);

    // Search users in company (excluding existing members)
    const users = await prisma.user.findMany({
      where: {
        companyId: session.user.companyId,
        deletedAt: null,
        id: {
          notIn: existingUserIds,
        },
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
      },
      take: 10, // Limit results
      orderBy: {
        firstName: "asc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
