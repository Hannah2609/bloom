import { prisma } from "@/lib/prisma";
import { SurveyListItem } from "@/types/survey";

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
