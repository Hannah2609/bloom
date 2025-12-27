import SurveyClient from "./SurveyClient";
import { getSession } from "@/lib/session/session";
import { redirect, notFound } from "next/navigation";
import { getSurveyById } from "@/lib/queries/surveys";

export default async function SurveyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const session = await getSession();

  // Check authentication
  if (!session.user) {
    redirect("/login");
  }

  // Check admin access
  if (session.user.role !== "ADMIN") {
    redirect("/home");
  }

  // Fetch survey with questions and teams
  const survey = await getSurveyById(id, session.user.companyId);

  if (!survey) {
    notFound();
  }

  return <SurveyClient survey={survey} />;
}
