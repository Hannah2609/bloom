import { prisma } from "@/lib/prisma";
import { SurveyListItem } from "@/types/survey";

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
