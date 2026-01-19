import { redirect } from "next/navigation";
import SurveysClient from "./SurveysClient";
import { getSession } from "@/lib/session/session";
import { getAllSurveys } from "@/lib/queries/surveys";

export default async function SurveysPage() {
  const session = await getSession();

  // Check authentication
  if (!session.user) {
    redirect("/login");
  }

  // Check admin access
  if (session.user.role !== "ADMIN") {
    redirect("/home");
  }

  // Fetch all surveys
  const surveys = await getAllSurveys(session.user.companyId);

  return <SurveysClient initialSurveys={surveys} />;
}
