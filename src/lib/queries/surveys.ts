import { prisma } from "@/lib/prisma";
import { SurveyListItem, SurveyDetail } from "@/types/survey";

// Admin: Get all surveys for company
export async function getAllSurveys(
  companyId: string
): Promise<SurveyListItem[]> {
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

// Fetch a single survey by ID with full details (questions, teams, responses)
export async function getSurveyById(
  surveyId: string,
  companyId: string
): Promise<SurveyDetail | null> {
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

// Employee: Get active surveys for user (global OR user's teams)
export async function getActiveSurveysForUser(
  companyId: string,
  userId: string
): Promise<SurveyListItem[]> {
  const now = new Date();

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
        {
          // Team-specific surveys where user is a member
          teams: {
            some: {
              team: {
                members: {
                  some: {
                    userId,
                  },
                },
              },
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

// Get active surveys for a specific team
export async function getActiveSurveysForTeam(
  teamId: string
): Promise<SurveyListItem[]> {
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
