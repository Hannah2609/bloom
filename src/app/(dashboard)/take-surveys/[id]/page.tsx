import { redirect } from "next/navigation";
import { getSurveyById, getActiveSurveysForUser } from "@/lib/queries/surveys";
import { getUserCompletedSurveys } from "@/lib/queries/responses";
import { hasUserSubmittedThisWeek } from "@/lib/queries/happiness";
import TakeSurveyClient from "./TakeSurveyClient";
import { getSession } from "@/lib/session/session";

interface TakeSurveyPageProps {
  params: Promise<{ id: string }>;
}

export default async function TakeSurveyPage({ params }: TakeSurveyPageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session.user) {
    redirect("/login");
  }

  const survey = await getSurveyById(id, session.user.companyId);

  if (!survey || survey.status !== "ACTIVE") {
    redirect("/home");
  }

  const isAdmin = session.user.role === "ADMIN";

  // Get data for sprout status
  const [activeSurveys, completedResponses, hasSubmittedHappiness] =
    await Promise.all([
      getActiveSurveysForUser(session.user.companyId, session.user.id),
      getUserCompletedSurveys(session.user.id),
      hasUserSubmittedThisWeek(session.user.id),
    ]);

  const completedSurveyIds = completedResponses.map((r) => r.surveyId);
  const hasPendingSurveys =
    activeSurveys.filter((s) => !completedSurveyIds.includes(s.id)).length > 0;

  return (
    <TakeSurveyClient
      survey={survey}
      isAdmin={isAdmin}
      activeSurveys={activeSurveys}
      completedSurveyIds={completedSurveyIds}
      hasSubmittedHappiness={hasSubmittedHappiness}
    />
  );
}
