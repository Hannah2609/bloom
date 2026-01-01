// app/(dashboard)/survey-analytics/[id]/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session/session";
import { getSurveyAnalytics } from "@/lib/queries/responses";
import AnalyticsClient from "./AnalyticsClient";

export default async function SurveyAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const { id } = await params;

  if (!session) {
    redirect("/login");
  }

  // Only admins can view analytics
  if (session.user.role !== "ADMIN") {
    redirect("/home");
  }

  let analytics;

  try {
    analytics = await getSurveyAnalytics(id, session.user.companyId);
  } catch (error) {
    console.error("Error loading analytics:", error);
    redirect("/create-surveys");
  }

  return <AnalyticsClient analytics={analytics} />;
}
