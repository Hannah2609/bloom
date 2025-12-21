import SurveyClient from "./SurveyClient";
import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";

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

  // get survey based on id

  return <SurveyClient />;
}
