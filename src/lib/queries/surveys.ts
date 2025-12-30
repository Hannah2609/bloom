import { prisma } from "@/lib/prisma";
import { SurveyListItem, SurveyDetail } from "@/types/survey";

/**
 * Update survey statuses based on current date
 * Should be called before fetching surveys to ensure DB is in sync
 */
async function syncSurveyStatuses(companyId: string) {
  const now = new Date();

  try {
    // Activate surveys that have reached start date
    await prisma.survey.updateMany({
      where: {
        companyId,
        status: "DRAFT",
        startDate: {
          lte: now,
        },
        deletedAt: null,
      },
      data: {
        status: "ACTIVE",
      },
    });

    // Close surveys that have reached end date
    await prisma.survey.updateMany({
      where: {
        companyId,
        status: "ACTIVE",
        endDate: {
          lte: now,
        },
        deletedAt: null,
      },
      data: {
        status: "CLOSED",
      },
    });
  } catch (error) {
    console.error("Error syncing survey statuses:", error);
    // Don't throw - continue with fetching even if sync fails
    // If sync fails, statuses will be updated on next call, and surveys won't be missing, just possibly outdated
    // Preventing user-facing errors is more important here
  }
}

/**
 * GET
 */
/**
 * Get all surveys for a company (admin)
 */
export async function getAllSurveys(
  companyId: string
): Promise<SurveyListItem[]> {
  // Sync statuses before fetching
  await syncSurveyStatuses(companyId);

  const surveys = await prisma.survey.findMany({
    where: {
      companyId,
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      isGlobal: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      _count: {
        select: {
          questions: true,
          responses: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return surveys.map((survey) => ({
    id: survey.id,
    title: survey.title,
    description: survey.description,
    status: survey.status,
    isGlobal: survey.isGlobal,
    startDate: survey.startDate?.toISOString() || null,
    endDate: survey.endDate?.toISOString() || null,
    createdAt: survey.createdAt.toISOString(),
    questionCount: survey._count.questions,
    responseCount: survey._count.responses,
  }));
}

/**
 * Fetch a single survey by ID with full details (questions, teams, responses)
 */
export async function getSurveyById(
  surveyId: string,
  companyId: string
): Promise<SurveyDetail | null> {
  // Sync statuses before fetching
  await syncSurveyStatuses(companyId);

  const survey = await prisma.survey.findFirst({
    where: {
      id: surveyId,
      companyId,
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      isGlobal: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      teams: {
        select: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      questions: {
        select: {
          id: true,
          title: true,
          description: true,
          required: true,
          order: true,
          answerType: true,
          surveyId: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          order: "asc",
        },
      },
      _count: {
        select: {
          questions: true,
          responses: true,
        },
      },
    },
  });

  if (!survey) {
    return null;
  }

  return {
    id: survey.id,
    title: survey.title,
    description: survey.description,
    status: survey.status,
    isGlobal: survey.isGlobal,
    startDate: survey.startDate?.toISOString() || null,
    endDate: survey.endDate?.toISOString() || null,
    createdAt: survey.createdAt.toISOString(),
    teams: survey.teams,
    questions: survey.questions.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      required: q.required,
      order: q.order,
      answerType: q.answerType,
      surveyId: q.surveyId,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
    })),
    questionCount: survey._count.questions,
    responseCount: survey._count.responses,
  };
}

/**
 * Get active surveys for user (global OR user's teams)
 */
export async function getActiveSurveysForUser(
  companyId: string,
  userId: string
): Promise<SurveyListItem[]> {
  // Sync statuses before fetching
  await syncSurveyStatuses(companyId);

  const now = new Date();

  // Get user's team IDs first (avoid complex nested query)
  const userTeamMemberships = await prisma.teamMember.findMany({
    where: {
      userId,
      leftAt: null, // Only active memberships
      team: {
        companyId,
        deletedAt: null,
      },
    },
    select: {
      teamId: true,
    },
  });

  const userTeamIds = userTeamMemberships.map((m) => m.teamId);

  const surveys = await prisma.survey.findMany({
    where: {
      companyId,
      deletedAt: null,
      status: "ACTIVE",
      startDate: {
        lte: now,
      },
      OR: [
        { isGlobal: true }, // Global surveys
        ...(userTeamIds.length > 0
          ? [
              {
                // Team-specific surveys for user's teams
                teams: {
                  some: {
                    teamId: {
                      in: userTeamIds,
                    },
                  },
                },
              },
            ]
          : []),
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      isGlobal: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      _count: {
        select: {
          questions: true,
          responses: true,
        },
      },
    },
    orderBy: {
      startDate: "desc",
    },
  });

  return surveys.map((survey) => ({
    id: survey.id,
    title: survey.title,
    description: survey.description,
    status: survey.status,
    isGlobal: survey.isGlobal,
    startDate: survey.startDate?.toISOString() || null,
    endDate: survey.endDate?.toISOString() || null,
    createdAt: survey.createdAt.toISOString(),
    questionCount: survey._count.questions,
    responseCount: survey._count.responses,
  }));
}

/**
 * Get active surveys for a specific team
 */
export async function getActiveSurveysForTeam(
  teamId: string
): Promise<SurveyListItem[]> {
  // Get team's companyId first to sync statuses
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { companyId: true },
  });

  if (team) {
    await syncSurveyStatuses(team.companyId);
  }

  const now = new Date();

  const surveys = await prisma.survey.findMany({
    where: {
      deletedAt: null,
      status: "ACTIVE",
      startDate: {
        lte: now,
      },
      OR: [
        { isGlobal: true }, // Global surveys
        {
          // Team-specific surveys for this team
          teams: {
            some: {
              teamId,
            },
          },
        },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      isGlobal: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      _count: {
        select: {
          questions: true,
          responses: true,
        },
      },
    },
    orderBy: {
      startDate: "desc",
    },
  });

  return surveys.map((survey) => ({
    id: survey.id,
    title: survey.title,
    description: survey.description,
    status: survey.status,
    isGlobal: survey.isGlobal,
    startDate: survey.startDate?.toISOString() || null,
    endDate: survey.endDate?.toISOString() || null,
    createdAt: survey.createdAt.toISOString(),
    questionCount: survey._count.questions,
    responseCount: survey._count.responses,
  }));
}

/**
 * Get all questions for a survey
 */
export async function getQuestionsBySurveyId(
  surveyId: string,
  companyId: string
) {
  // Verify survey belongs to company
  const survey = await prisma.survey.findFirst({
    where: {
      id: surveyId,
      companyId,
      deletedAt: null,
    },
  });

  if (!survey) {
    throw new Error("Survey not found");
  }

  return await prisma.question.findMany({
    where: { surveyId },
    orderBy: { order: "asc" },
  });
}

/**
 * POST
 */

/**
 * Create a new survey
 */
export async function createSurvey(
  companyId: string,
  data: {
    title: string;
    description?: string;
    isGlobal: boolean;
    startDate?: Date;
    endDate?: Date;
    teamIds?: string[];
  }
) {
  const survey = await prisma.survey.create({
    data: {
      title: data.title,
      description: data.description,
      isGlobal: data.isGlobal,
      startDate: data.startDate,
      endDate: data.endDate,
      companyId,
      // Create SurveyTeam junction records if teams are specified
      teams:
        data.teamIds && data.teamIds.length > 0
          ? {
              create: data.teamIds.map((teamId) => ({
                teamId,
              })),
            }
          : undefined,
    },
    include: {
      teams: {
        include: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return survey;
}

/**
 * Create a new question for a survey
 */
export async function createQuestion(
  surveyId: string,
  data: {
    title: string;
    description?: string;
    answerType: "SATISFACTION" | "AGREEMENT" | "SCALE";
    required: boolean;
  },
  companyId: string
) {
  // Verify survey exists and belongs to company
  const survey = await prisma.survey.findFirst({
    where: {
      id: surveyId,
      companyId,
      deletedAt: null,
    },
  });

  if (!survey) {
    throw new Error("Survey not found");
  }

  // Get the current max order number
  const maxOrder = await prisma.question.aggregate({
    where: { surveyId },
    _max: { order: true },
  });

  const nextOrder = (maxOrder._max.order || 0) + 1;

  // Create the question
  return await prisma.question.create({
    data: {
      title: data.title,
      description: data.description,
      answerType: data.answerType,
      required: data.required,
      order: nextOrder,
      surveyId,
    },
  });
}

/**
 * Update an existing question
 */
export async function updateQuestion(
  questionId: string,
  surveyId: string,
  data: {
    title: string;
    description?: string;
    answerType: "SATISFACTION" | "AGREEMENT" | "SCALE";
    required: boolean;
  },
  companyId: string
) {
  // Verify survey exists and belongs to company
  const survey = await prisma.survey.findFirst({
    where: {
      id: surveyId,
      companyId,
      deletedAt: null,
    },
  });

  if (!survey) {
    throw new Error("Survey not found");
  }

  // Verify question exists and belongs to survey
  const question = await prisma.question.findFirst({
    where: {
      id: questionId,
      surveyId,
    },
  });

  if (!question) {
    throw new Error("Question not found");
  }

  // Update the question
  return await prisma.question.update({
    where: { id: questionId },
    data: {
      title: data.title,
      description: data.description,
      answerType: data.answerType,
      required: data.required,
    },
  });
}

/**
 * Reorder questions in a survey
 * Updates all question orders atomically in a transaction
 */
export async function reorderQuestions(
  surveyId: string,
  questionOrders: { questionId: string; order: number }[],
  companyId: string
) {
  // Verify survey exists and belongs to company
  const survey = await prisma.survey.findFirst({
    where: {
      id: surveyId,
      companyId,
      deletedAt: null,
    },
  });

  if (!survey) {
    throw new Error("Survey not found");
  }

  // Verify all questions belong to this survey
  const questionIds = questionOrders.map((q) => q.questionId);
  const questions = await prisma.question.findMany({
    where: {
      id: { in: questionIds },
      surveyId,
    },
  });

  if (questions.length !== questionIds.length) {
    throw new Error("One or more questions not found");
  }

  // Update all orders in a transaction (atomic operation)
  return await prisma.$transaction(
    questionOrders.map(({ questionId, order }) =>
      prisma.question.update({
        where: { id: questionId },
        data: { order },
      })
    )
  );
}
