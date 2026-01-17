import { NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all happiness scores for the company (since first response)
    const scores = await prisma.happinessScore.findMany({
      where: {
        companyId: session.user.companyId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (scores.length === 0) {
      return NextResponse.json({
        data: {
          overallAverage: 0,
          totalResponses: 0,
          firstResponseDate: null,
        },
      });
    }

    // Calculate overall average (convert from 1-10 to 0.5-5.0 scale)
    const total = scores.reduce((sum, score) => sum + score.score / 2, 0);
    const overallAverage = total / scores.length;

    // Get first response date
    const firstResponseDate = scores[0].createdAt;

    return NextResponse.json({
      data: {
        overallAverage,
        totalResponses: scores.length,
        firstResponseDate: firstResponseDate.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching overall happiness:", error);
    return NextResponse.json(
      { error: "Failed to fetch overall happiness" },
      { status: 500 }
    );
  }
}
