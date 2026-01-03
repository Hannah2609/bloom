import { redirect } from "next/navigation";
import { getSession } from "@/lib/session/session";
import { getTeamById, canUserAccessTeam } from "@/lib/queries/teams";
import { getActiveSurveysForTeam } from "@/lib/queries/surveys";
import { getUserCompletedSurveys } from "@/lib/queries/responses";
import TeamClient from "./TeamClient";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  if (!session.user) {
    redirect("/login");
  }

  const { id } = await params;

  // Check if user can access this team
  const hasAccess = await canUserAccessTeam(
    id,
    session.user.id,
    session.user.role,
    session.user.companyId
  );

  if (!hasAccess) {
    redirect("/teams");
  }

  // Fetch team details
  const team = await getTeamById(id);

  if (!team) {
    redirect("/teams");
  }

  // Fetch active surveys for this team (global or team-specific)
  const [activeSurveys, completedResponses] = await Promise.all([
    getActiveSurveysForTeam(id),
    getUserCompletedSurveys(session.user.id),
  ]);

  const completedSurveyIds = completedResponses.map((r) => r.surveyId);

  const isAdmin = session.user.role === "ADMIN";

  return (
    <TeamClient
      team={team}
      isAdmin={isAdmin}
      activeSurveys={activeSurveys}
      completedSurveyIds={completedSurveyIds}
    />
  );
}
