import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";
import HomeClient from "./HomeClient";
import { getActiveSurveysForUser } from "@/lib/queries/surveys";

export default async function HomePage() {
  const session = await getSession();

  // Check authentication
  if (!session.user) {
    redirect("/login");
  }

  const activeSurveys = await getActiveSurveysForUser(
    session.user.companyId,
    session.user.id
  );

  return <HomeClient user={session.user} activeSurveys={activeSurveys} />;
}
