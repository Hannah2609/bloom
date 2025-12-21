import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const session = await getSession();

  // Check authentication
  if (!session.user) {
    redirect("/login");
  }

  return <HomeClient user={session.user} />;
}
