import { prisma } from "@/lib/prisma";

/**
 * Calculate rating distribution with percentages
 */
export function calculateDistribution(
  ratingValues: number[]
): { rating: number; count: number; percentage: number }[] {
  return [1, 2, 3, 4, 5].map((rating) => {
    const count = ratingValues.filter((value) => value === rating).length;
    const percentage =
      ratingValues.length > 0 ? (count / ratingValues.length) * 100 : 0;

    return {
      rating,
      count,
      percentage,
    };
  });
}

/**
 * Calculate average rating
 */
export function calculateAverage(ratingValues: number[]): number {
  if (ratingValues.length === 0) return 0;
  const total = ratingValues.reduce((sum, value) => sum + value, 0);
  return total / ratingValues.length;
}

/**
 * Submit survey response with answers
 */
export async function submitSurveyResponse(data: {
  surveyId: string;
  userId: string;
  companyId: string;
  answers: Array<{ questionId: string; ratingValue: number }>;
}) {
  // Verify survey exists and belongs to company
  const survey = await prisma.survey.findFirst({
    where: {
      id: data.surveyId,
      companyId: data.companyId,
      deletedAt: null,
      status: "ACTIVE",
    },
    include: {
      questions: {
        select: {
          id: true,
          required: true,
        },
      },
    },
  });

  if (!survey) {
    throw new Error("Survey not found or not active");
  }

  // Verify all required questions are answered
  const requiredQuestionIds = survey.questions
    .filter((q) => q.required)
    .map((q) => q.id);
  const answeredQuestionIds = data.answers.map((a) => a.questionId);

  const missingRequired = requiredQuestionIds.filter(
    (id) => !answeredQuestionIds.includes(id)
  );

  if (missingRequired.length > 0) {
    throw new Error("All required questions must be answered");
  }

  // Create response with answers
  const response = await prisma.surveyResponse.create({
    data: {
      surveyId: data.surveyId,
      userId: data.userId,
      answers: {
        create: data.answers.map((answer) => ({
          questionId: answer.questionId,
          ratingValue: answer.ratingValue,
        })),
      },
    },
    include: {
      answers: true,
    },
  });

  return response;
}

/**
 * Get user's completed surveys
 */
export async function getUserCompletedSurveys(userId: string) {
  const responses = await prisma.surveyResponse.findMany({
    where: {
      userId,
    },
    select: {
      surveyId: true,
      submittedAt: true,
    },
    orderBy: {
      submittedAt: "desc",
    },
  });

  return responses;
}

/**
 * Get survey analytics data (admin only)
 */
export async function getSurveyAnalytics(surveyId: string, companyId: string) {
  // Verify survey exists and belongs to company
  const survey = await prisma.survey.findFirst({
    where: {
      id: surveyId,
      companyId,
      deletedAt: null,
    },
    include: {
      questions: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          answerType: true,
          order: true,
        },
      },
      _count: {
        select: {
          responses: true,
        },
      },
    },
  });

  if (!survey) {
    throw new Error("Survey not found");
  }

  // Get all answers
  const answers = await prisma.answer.findMany({
    where: {
      response: {
        surveyId,
      },
    },
    select: {
      questionId: true,
      ratingValue: true,
    },
  });

  // Aggregate data per question
  const questionAnalytics = survey.questions.map((question) => {
    const questionAnswers = answers.filter((a) => a.questionId === question.id);
    const ratingValues = questionAnswers.map((a) => a.ratingValue);

    return {
      questionId: question.id,
      title: question.title,
      description: question.description,
      answerType: question.answerType,
      order: question.order,
      responseCount: questionAnswers.length,
      average: calculateAverage(ratingValues),
      distribution: calculateDistribution(ratingValues),
    };
  });

  return {
    surveyId: survey.id,
    title: survey.title,
    description: survey.description,
    status: survey.status,
    isGlobal: survey.isGlobal,
    totalResponses: survey._count.responses,
    questions: questionAnalytics,
  };
}
