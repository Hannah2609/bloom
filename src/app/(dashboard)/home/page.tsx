import { redirect } from "next/navigation";
import { getActiveSurveysForUser } from "@/lib/queries/surveys";
import { getUserCompletedSurveys } from "@/lib/queries/responses";
import HomeClient from "./HomeClient";
import { getSession } from "@/lib/session/session";

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const [activeSurveys, completedResponses] = await Promise.all([
    getActiveSurveysForUser(session.user.companyId, session.user.id),
    getUserCompletedSurveys(session.user.id),
  ]);

  const completedSurveyIds = completedResponses.map((r) => r.surveyId);

  return (
    <HomeClient
      user={session.user}
      activeSurveys={activeSurveys}
      completedSurveyIds={completedSurveyIds}
    />
  );
}
