import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session/session";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const excludeTeamId = searchParams.get("excludeTeamId");

    let existingUserIds: string[] = [];

    // Exclude members of specific team if provided
    if (excludeTeamId) {
      const existingMembers = await prisma.teamMember.findMany({
        where: {
          teamId: excludeTeamId,
          leftAt: null,
        },
        select: { userId: true },
      });
      existingUserIds = existingMembers.map((m) => m.userId);
    }

    const users = await prisma.user.findMany({
      where: {
        companyId: session.user.companyId,
        deletedAt: null,
        ...(existingUserIds.length > 0 && {
          id: { notIn: existingUserIds },
        }),
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
      take: 10,
      orderBy: { firstName: "asc" },
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

