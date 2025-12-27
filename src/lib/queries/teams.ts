import { prisma } from "@/lib/prisma";
import { Team, TeamWithMembers, TeamMember } from "@/types/team";

// Get all teams for a company
export async function getAllTeams(companyId: string): Promise<Team[]> {
  const teams = await prisma.team.findMany({
    where: {
      companyId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      companyId: true,
      deletedAt: true,
      _count: {
        select: {
          members: {
            where: {
              leftAt: null, // Only count active members
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
    companyId: team.companyId,
    deletedAt: team.deletedAt,
    memberCount: team._count.members,
  }));
}

// Get teams where user is a member
export async function getUserTeams(
  companyId: string,
  userId: string
): Promise<Team[]> {
  const teams = await prisma.team.findMany({
    where: {
      companyId,
      deletedAt: null,
      members: {
        some: {
          userId,
          leftAt: null, // Only active memberships
        },
      },
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      companyId: true,
      deletedAt: true,
      _count: {
        select: {
          members: {
            where: {
              leftAt: null,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
    companyId: team.companyId,
    deletedAt: team.deletedAt,
    memberCount: team._count.members,
  }));
}

// Get team by ID with full member details
export async function getTeamById(
  teamId: string
): Promise<TeamWithMembers | null> {
  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      companyId: true,
      deletedAt: true,
      members: {
        where: {
          leftAt: null, // Only active members
        },
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
        orderBy: {
          joinedAt: "desc",
        },
      },
    },
  });

  if (!team || team.deletedAt) {
    return null;
  }

  return {
    id: team.id,
    name: team.name,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
    companyId: team.companyId,
    deletedAt: team.deletedAt,
    members: team.members.map((member) => ({
      id: member.id,
      userId: member.userId,
      role: member.role,
      joinedAt: member.joinedAt,
      leftAt: member.leftAt,
      user: {
        firstName: member.user.firstName,
        lastName: member.user.lastName,
        email: member.user.email,
        avatar: member.user.avatar,
      },
    })),
  };
}

// Check if user is member of team
export async function isUserTeamMember(
  teamId: string,
  userId: string
): Promise<boolean> {
  const membership = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId,
      leftAt: null,
    },
  });

  return !!membership;
}

// Check if user has access to team (admin or member)
export async function canUserAccessTeam(
  teamId: string,
  userId: string,
  userRole: string,
  companyId: string
): Promise<boolean> {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      companyId: true,
      deletedAt: true,
    },
  });

  if (!team || team.deletedAt || team.companyId !== companyId) {
    return false;
  }

  // Admins can access all teams in their company
  if (userRole === "ADMIN") {
    return true;
  }

  // Non-admins must be members
  return await isUserTeamMember(teamId, userId);
}
