// src/lib/queries/responses.ts
import { prisma } from "@/lib/prisma";

/**
 * Check if user has completed a survey
 */
export async function hasUserCompletedSurvey(
  surveyId: string,
  userId: string
): Promise<boolean> {
  const response = await prisma.surveyResponse.findUnique({
    where: {
      surveyId_userId: {
        surveyId,
        userId,
      },
    },
  });

  return !!response;
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
      teams: {
        select: {
          teamId: true,
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

  // Determine teamId based on survey type
  let teamId: string | null = null;

  if (survey.isGlobal) {
    // Global survey: teamId is null
    teamId = null;
  } else {
    // Targeted survey: Find which of the survey's target teams the user belongs to
    const surveyTeamIds = survey.teams.map((t) => t.teamId);

    const userTeamMembership = await prisma.teamMember.findFirst({
      where: {
        userId: data.userId,
        teamId: { in: surveyTeamIds },
        leftAt: null,
      },
      orderBy: {
        joinedAt: "asc", // Use oldest membership if user is in multiple target teams
      },
      select: {
        teamId: true,
      },
    });

    teamId = userTeamMembership?.teamId || null;
  }

  // Create response with answers in a transaction
  const response = await prisma.surveyResponse.create({
    data: {
      surveyId: data.surveyId,
      userId: data.userId,
      teamId,
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
