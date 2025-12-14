import { getSession } from "@/lib/session/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const session = await getSession();

  // Check authentication
  if (!session.user) {
    redirect("/login");
  }

  // Check admin access
  if (session.user.role !== "ADMIN") {
    redirect("/home");
  }

  // Fetch all users in the same company
  const users = await prisma.user.findMany({
    where: {
      companyId: session.user.companyId,
      deletedAt: null,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <AdminClient initialUsers={users} />;
}
