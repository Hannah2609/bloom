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
export async function getUserPrimaryTeam(
  userId: string
): Promise<string | null> {
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

    // 2. Store anonymous score (team level if in team, otherwise company level only)
    prisma.happinessScore.create({
      data: {
        ...(teamId && { teamId }),
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
  startDate.setDate(startDate.getDate() - weeks * 7);

  // Query team-level and company-level data - no userId ever exposed
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

  // Aggregate by week and team (only include scores with teams)
  const weeklyData = scores.reduce(
    (acc, score) => {
      // Only aggregate scores that have a team (skip company-level only scores)
      if (!score.teamId || !score.team) {
        return acc;
      }

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
    },
    {} as Record<
      string,
      Record<string, { teamName: string; total: number; count: number }>
    >
  );

  // Format response
  const aggregated = Object.entries(weeklyData).map(([weekStart, teams]) => ({
    weekStart,
    teams: Object.values(teams).map((team) => ({
      teamName: team.teamName,
      average: team.count > 0 ? team.total / team.count : 0,
      count: team.count,
    })),
  }));

  return aggregated;
}

/**
 * Get weekly happiness analytics for admin dashboard
 * Supports filtering by team or showing company-wide data
 */
export async function getWeeklyHappinessAnalytics(
  companyId: string,
  options: {
    weeks?: number;
    teamId?: string;
    companyLevel?: boolean;
    viewType?: "weekly" | "monthly";
  } = {}
) {
  const {
    weeks = 12,
    teamId,
    companyLevel = false,
    viewType = "weekly",
  } = options;

  const endDate = new Date();
  const startDate = new Date();
  // Calculate start date based on view type
  if (viewType === "monthly") {
    // For monthly view, "weeks" parameter actually means months
    startDate.setMonth(startDate.getMonth() - weeks);
    // Set to first day of that month
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
  } else {
    // For weekly view, calculate the Monday of the week that is (weeks-1) weeks ago
    // This ensures we get exactly 'weeks' number of weeks including the current week
    const daysSinceMonday = (endDate.getDay() + 6) % 7; // 0 = Monday, 6 = Sunday
    const mondayOfCurrentWeek = new Date(endDate);
    mondayOfCurrentWeek.setDate(endDate.getDate() - daysSinceMonday);
    mondayOfCurrentWeek.setHours(0, 0, 0, 0);

    // Go back (weeks - 1) weeks to get the start of the range
    startDate.setTime(
      mondayOfCurrentWeek.getTime() - (weeks - 1) * 7 * 24 * 60 * 60 * 1000
    );
  }

  // Build where clause
  // For monthly view, we need to include all weeks in the month range
  const where: {
    companyId: string;
    teamId?: string;
    weekStartDate: {
      gte: Date;
      lte?: Date;
      lt?: Date;
    };
  } = {
    companyId,
    weekStartDate: {} as { gte: Date; lte?: Date; lt?: Date },
  };

  if (viewType === "monthly") {
    // For monthly, we want all scores from start month to current month
    // Include all dates from start of first month to end of current month
    const endMonthStart = new Date();
    endMonthStart.setMonth(endMonthStart.getMonth() + 1);
    endMonthStart.setDate(1);
    endMonthStart.setHours(0, 0, 0, 0);

    where.weekStartDate = {
      gte: startDate,
      lt: endMonthStart, // Less than first day of next month (includes current month)
    };
  } else {
    // For weekly view, weekStartDate is always Monday
    // Set endDate to Monday of current week (or later if we want to include future weeks)
    const daysSinceMonday = (endDate.getDay() + 6) % 7; // 0 = Monday, 6 = Sunday
    const mondayOfCurrentWeek = new Date(endDate);
    mondayOfCurrentWeek.setDate(endDate.getDate() - daysSinceMonday);
    mondayOfCurrentWeek.setHours(0, 0, 0, 0);

    // Include current week's Monday in the range
    where.weekStartDate = {
      gte: startDate,
      lte: mondayOfCurrentWeek,
    };
  }

  // Filter by team if specified
  if (teamId) {
    where.teamId = teamId;
  }

  // Get team name if teamId is specified (for filling missing weeks)
  let teamName: string | undefined;
  if (teamId) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { name: true },
    });
    teamName = team?.name;
  }

  const scores = await prisma.happinessScore.findMany({
    where,
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

  // Aggregate by week or month
  const aggregatedData = scores.reduce(
    (acc, score) => {
      // Group by month or week based on viewType
      let periodKey: string;
      if (viewType === "monthly") {
        // Use first day of month as key (YYYY-MM-01 format)
        const date = new Date(score.weekStartDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() returns 0-11
        periodKey = `${year}-${String(month).padStart(2, "0")}-01`;
      } else {
        // Use week start date as key
        periodKey = score.weekStartDate.toISOString().split("T")[0];
      }

      if (!acc[periodKey]) {
        acc[periodKey] = {
          companyTotal: 0,
          companyCount: 0,
          teams: {} as Record<
            string,
            { teamName: string; total: number; count: number }
          >,
        };
      }

      // Company-level aggregation (always - includes scores with and without teams)
      acc[periodKey].companyTotal += score.score / 2; // Convert 1-10 to 0.5-5.0
      acc[periodKey].companyCount += 1;

      // Team-level aggregation (only if teamId exists and team relation is loaded)
      if (score.teamId && "team" in score && score.team) {
        const teamKey = score.teamId;
        if (!acc[periodKey].teams[teamKey]) {
          acc[periodKey].teams[teamKey] = {
            teamName: score.team.name,
            total: 0,
            count: 0,
          };
        }
        acc[periodKey].teams[teamKey].total += score.score / 2;
        acc[periodKey].teams[teamKey].count += 1;
      }

      return acc;
    },
    {} as Record<
      string,
      {
        companyTotal: number;
        companyCount: number;
        teams: Record<
          string,
          { teamName: string; total: number; count: number }
        >;
      }
    >
  );

  // Format response and sort by period
  let result = Object.entries(aggregatedData)
    .map(([periodStart, data]) => ({
      weekStart: periodStart, // Keep same field name for compatibility
      companyAverage:
        data.companyCount > 0 ? data.companyTotal / data.companyCount : 0,
      teamAverages: companyLevel
        ? [] // Don't include teams if company-level only
        : Object.entries(data.teams).map(([teamId, team]) => ({
            teamId,
            teamName: team.teamName,
            average: team.count > 0 ? team.total / team.count : 0,
            responseCount: team.count,
          })),
      totalResponses: data.companyCount,
    }))
    .sort((a, b) => {
      // Sort by date string (ISO format sorts correctly)
      return a.weekStart.localeCompare(b.weekStart);
    });

  // For monthly view, fill in missing months with zero data
  if (viewType === "monthly") {
    const filledResult = [];
    // Use the calculated startDate to generate all months
    // startDate is already set to first day of the start month
    const currentMonth = new Date(startDate);
    // Calculate end month (current month)
    const endMonth = new Date();
    endMonth.setDate(1); // First day of current month
    endMonth.setHours(0, 0, 0, 0);

    const resultMap = new Map(result.map((r) => [r.weekStart, r]));

    // Generate all months from startDate to endMonth (inclusive, including current month)
    while (currentMonth <= endMonth) {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const monthKey = `${year}-${String(month).padStart(2, "0")}-01`;

      if (resultMap.has(monthKey)) {
        filledResult.push(resultMap.get(monthKey)!);
      } else {
        // Add empty month
        filledResult.push({
          weekStart: monthKey,
          companyAverage: 0,
          teamAverages: [],
          totalResponses: 0,
        });
      }

      // Move to next month
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    result = filledResult;
  } else if (teamId) {
    // For weekly view with teamId filter, fill in missing weeks with zero data
    // This ensures we show all weeks in the range, even if the team has no data for some weeks
    const filledResult = [];
    const resultMap = new Map(result.map((r) => [r.weekStart, r]));

    // Generate all weeks from startDate to mondayOfCurrentWeek
    const daysSinceMonday = (endDate.getDay() + 6) % 7;
    const mondayOfCurrentWeek = new Date(endDate);
    mondayOfCurrentWeek.setDate(endDate.getDate() - daysSinceMonday);
    mondayOfCurrentWeek.setHours(0, 0, 0, 0);

    const currentWeek = new Date(startDate);

    while (currentWeek <= mondayOfCurrentWeek) {
      const weekKey = currentWeek.toISOString().split("T")[0];

      if (resultMap.has(weekKey)) {
        filledResult.push(resultMap.get(weekKey)!);
      } else {
        // Add empty week with zero data for the team
        filledResult.push({
          weekStart: weekKey,
          companyAverage: 0,
          teamAverages: teamName
            ? [
                {
                  teamId,
                  teamName,
                  average: 0,
                  responseCount: 0,
                },
              ]
            : [],
          totalResponses: 0,
        });
      }

      // Move to next week (add 7 days)
      currentWeek.setDate(currentWeek.getDate() + 7);
    }

    result = filledResult;
  }

  return result;
}
