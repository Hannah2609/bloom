import { prisma } from "@/lib/prisma";

/**
 * Get current week's Monday (ISO week)
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0); // Set to start of day
  return monday;
}

/**
 * Check if user has submitted happiness score for current week
 */
export async function hasUserSubmittedThisWeek(
  userId: string
): Promise<boolean> {
  const weekStart = getWeekStart();
  
  const submission = await prisma.happinessScoreSubmission.findUnique({
    where: {
      userId_weekStartDate: {
        userId,
        weekStartDate: weekStart,
      },
    },
  });

  return !!submission;
}

/**
 * Get user's primary team (first active team membership)
 */
export async function getUserPrimaryTeam(userId: string): Promise<string | null> {
  const teamMember = await prisma.teamMember.findFirst({
    where: {
      userId,
      leftAt: null, // Active membership
    },
    select: {
      teamId: true,
    },
    orderBy: {
      joinedAt: "asc", // Get oldest team (primary)
    },
  });

  return teamMember?.teamId || null;
}

/**
 * Submit happiness score (creates both submission tracking and anonymous score)
 */
export async function submitHappinessScore(
  userId: string,
  companyId: string,
  score: number
): Promise<void> {
  const weekStart = getWeekStart();
  const scoreInt = Math.round(score * 2); // Convert 0.5-5.0 to 1-10

  // Get user's primary team
  const teamId = await getUserPrimaryTeam(userId);
  
  if (!teamId) {
    throw new Error("User must be in a team to submit happiness score");
  }

  // Use transaction to ensure both operations succeed
  await prisma.$transaction([
    // 1. Track that user has submitted (for card visibility)
    prisma.happinessScoreSubmission.upsert({
      where: {
        userId_weekStartDate: {
          userId,
          weekStartDate: weekStart,
        },
      },
      update: {
        submittedAt: new Date(),
      },
      create: {
        userId,
        weekStartDate: weekStart,
      },
    }),
    
    // 2. Store anonymous score (team level only - NO userId)
    prisma.happinessScore.create({
      data: {
        teamId,
        companyId,
        score: scoreInt,
        weekStartDate: weekStart,
      },
    }),
  ]);
}

/**
 * Get aggregated happiness scores for analytics (admin only)
 * Returns team-level aggregated data - completely anonymous
 */
export async function getHappinessAnalytics(
  companyId: string,
  weeks: number = 12
) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (weeks * 7));

  // Query ONLY team-level data - no userId ever exposed
  const scores = await prisma.happinessScore.findMany({
    where: {
      companyId,
      weekStartDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      team: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      weekStartDate: "asc",
    },
  });

  // Aggregate by week and team
  const weeklyData = scores.reduce((acc, score) => {
    const weekKey = score.weekStartDate.toISOString().split("T")[0];
    const teamKey = score.teamId;
    
    if (!acc[weekKey]) {
      acc[weekKey] = {};
    }
    if (!acc[weekKey][teamKey]) {
      acc[weekKey][teamKey] = {
        teamName: score.team.name,
        total: 0,
        count: 0,
      };
    }
    
    acc[weekKey][teamKey].total += score.score / 2; // Convert to 0.5-5.0
    acc[weekKey][teamKey].count += 1;
    return acc;
  }, {} as Record<string, Record<string, { teamName: string; total: number; count: number }>>);

  // Format response
  const aggregated = Object.entries(weeklyData).map(([weekStart, teams]) => ({
    weekStart,
    teams: Object.values(teams).map(team => ({
      teamName: team.teamName,
      average: team.count > 0 ? team.total / team.count : 0,
      count: team.count,
    })),
  }));

  return aggregated;
}

