import { redirect } from "next/navigation";
import { getSurveyById } from "@/lib/queries/surveys";
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

  return <TakeSurveyClient survey={survey} isAdmin={isAdmin} />;
}
