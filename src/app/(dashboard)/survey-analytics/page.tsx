import { redirect } from "next/navigation";
import SurveyAnalyticsOverviewClient from "./SurveyAnalyticsOverviewClient";
import { getSession } from "@/lib/session/session";
import { getAllSurveys } from "@/lib/queries/surveys";

export default async function SurveyAnalyticsPage() {
  const session = await getSession();

  // Check authentication
  if (!session) {
    redirect("/login");
  }

  // Check admin access
  if (session.user.role !== "ADMIN") {
    redirect("/home");
  }

  // Fetch all surveys
  const surveys = await getAllSurveys(session.user.companyId);

  return <SurveyAnalyticsOverviewClient initialSurveys={surveys} />;
}
