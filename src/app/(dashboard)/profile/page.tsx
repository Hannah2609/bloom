import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";
import { getUserWithCompanyById } from "@/lib/queries/users";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session.user) {
    redirect("/login");
  }

  const user = await getUserWithCompanyById(session.user.id);

  if (!user) {
    redirect("/login");
  }

  return <ProfileClient user={user} />;
}
