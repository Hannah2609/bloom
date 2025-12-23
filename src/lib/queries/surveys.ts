import { prisma } from "@/lib/prisma";
import { SurveyListItem, SurveyDetail } from "@/types/survey";

// Fetch all surveys for a company (admin view
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
      surveyId: q.surveyId,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
    })),
    questionCount: survey._count.questions,
    responseCount: survey._count.responses,
  };
}
