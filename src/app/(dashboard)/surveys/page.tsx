import { redirect } from "next/navigation";
import SurveysClient from "./SurveysClient";
import { getSession } from "@/lib/session/session";

export default async function SurveysPage() {
  const session = await getSession();

  // Check authentication
  if (!session.user) {
    redirect("/login");
  }

  return <SurveysClient />;
}
