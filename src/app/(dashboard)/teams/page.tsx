import { redirect } from "next/navigation";
import { getSession } from "@/lib/session/session";
import { getAllTeams, getUserTeams } from "@/lib/queries/teams";
import TeamsClient from "./TeamsClient";

export default async function TeamsPage() {
  const session = await getSession();

  if (!session.user) {
    redirect("/login");
  }

  // Admins see all teams, others see only their teams
  const teams =
    session.user.role === "ADMIN"
      ? await getAllTeams(session.user.companyId)
      : await getUserTeams(session.user.companyId, session.user.id);

  const isAdmin = session.user.role === "ADMIN";

  return <TeamsClient teams={teams} isAdmin={isAdmin} />;
}
