import { getSession } from "@/lib/session/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TeamsClient from "./TeamsClient";

export default async function TeamsPage() {
  const session = await getSession();

  // Check authentication
  if (!session.user) {
    redirect("/login");
  }

  // Fetch teams based on user role
  let teams;

  if (session.user.role === "ADMIN") {
    // Admin: Fetch all teams in the company
    teams = await prisma.team.findMany({
      where: {
        companyId: session.user.companyId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        members: {
          where: {
            leftAt: null, // Only active members
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    // Non-admin: Fetch only teams the user is a member of
    teams = await prisma.team.findMany({
      where: {
        companyId: session.user.companyId,
        deletedAt: null,
        members: {
          some: {
            userId: session.user.id,
            leftAt: null, // Only active memberships
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        members: {
          where: {
            leftAt: null, // Only active members
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Map teams to include member count
  const teamsWithMemberCount = teams.map((team) => ({
    id: team.id,
    name: team.name,
    memberCount: team.members.length,
    createdAt: team.createdAt.toISOString(),
    updatedAt: team.updatedAt.toISOString(),
  }));

  const isAdmin = session.user.role === "ADMIN";

  return <TeamsClient initialTeams={teamsWithMemberCount} isAdmin={isAdmin} />;
}
