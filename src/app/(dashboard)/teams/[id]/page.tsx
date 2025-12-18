import React from "react";
import TeamClient from "./TeamClient";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session/session";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  // Check authentication
  if (!session.user) {
    redirect("/login");
  }

  const { id } = await params;

  // Fetch team and check if it's deleted
  const team = await prisma.team.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      companyId: true,
      deletedAt: true,
      members: {
        select: {
          id: true,
          userId: true,
          role: true,
          joinedAt: true,
          leftAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
        },
        where: {
          leftAt: null, // Only active members
        },
      },
    },
  });

  // Check if team exists and is not deleted
  if (!team || team.deletedAt) {
    redirect("/teams");
  }

  const user = session.user;

  // Check if team belongs to user's company
  if (team.companyId !== user.companyId) {
    redirect("/teams");
  }

  // Check if user has access to this team
  // Admin can see all teams in company, non-admin only teams they're members of
  if (user.role !== "ADMIN") {
    const isMember = team.members.some(
      (member) => member.userId === user.id && !member.leftAt
    );
    if (!isMember) {
      redirect("/teams");
    }
  }

  const teamData = {
    id: team.id,
    name: team.name,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
    deletedAt: team.deletedAt,
    companyId: team.companyId,
    members: team.members,
  };

  const isAdmin = session.user.role === "ADMIN";

  return <TeamClient team={teamData} isAdmin={isAdmin} />;
}
