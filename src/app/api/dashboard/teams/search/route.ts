import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query || query.trim() === "") {
      return NextResponse.json({ teams: [] });
    }

    const teams = await prisma.team.findMany({
      where: {
        companyId: session.user.companyId,
        deletedAt: null,
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
      take: 10,
      orderBy: {
        name: "asc",
      },
    });

    const teamsWithCount = teams.map((team) => ({
      id: team.id,
      name: team.name,
      memberCount: team._count.members,
    }));

    return NextResponse.json({ teams: teamsWithCount });
  } catch (error) {
    console.error("Error searching teams:", error);
    return NextResponse.json(
      { error: "Failed to search teams" },
      { status: 500 }
    );
  }
}
