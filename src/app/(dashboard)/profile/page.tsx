import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await getSession();

  // Check authentication
  if (!session.user) {
    redirect("/login");
  }

  return <ProfileClient user={session.user} />;
}