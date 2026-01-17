import { prisma } from "@/lib/prisma";
import { Team, TeamWithMembers } from "@/types/team";

/**
 * GET
 */
/**
 * Get all teams for a company (admin)
 */
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

/**
 * Get teams where user is a member (non-admin)
 */
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

/**
 * Get team by ID with full member details
 */
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

/**
 * Search teams by name
 */
export async function searchTeams(
  companyId: string,
  query: string
): Promise<Array<{ id: string; name: string; memberCount: number }>> {
  if (!query || query.trim() === "") {
    return [];
  }

  const teams = await prisma.team.findMany({
    where: {
      companyId,
      deletedAt: null,
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    include: {
      _count: {
        select: {
          members: true,
        },
      },
    },
    take: 10,
    orderBy: {
      name: "asc",
    },
  });

  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    memberCount: team._count.members,
  }));
}

/**
 * Search users for team (excluding existing members)
 */
export async function searchUsersForTeam(
  companyId: string,
  teamId: string,
  query: string
): Promise<
  Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  }>
> {
  // Verify team exists and belongs to company
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      companyId,
      deletedAt: null,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  // Get existing member IDs to exclude them
  const existingMembers = await prisma.teamMember.findMany({
    where: {
      teamId,
      leftAt: null,
    },
    select: { userId: true },
  });
  const existingUserIds = existingMembers.map((m) => m.userId);

  // Search users in company (excluding existing members)
  const users = await prisma.user.findMany({
    where: {
      companyId,
      deletedAt: null,
      id: {
        notIn: existingUserIds,
      },
      OR: [
        { firstName: { contains: query, mode: "insensitive" } },
        { lastName: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatar: true,
    },
    take: 10, // Limit results
    orderBy: {
      firstName: "asc",
    },
  });

  return users;
}

/**
 * POST
 */
/**
 * Create a new team
 */
export async function createTeam(
  companyId: string,
  name: string
): Promise<{
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}> {
  const team = await prisma.team.create({
    data: {
      name,
      companyId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return team;
}

/**
 * Add members to a team
 */
export async function addTeamMembers(
  companyId: string,
  teamId: string,
  userIds: string[]
): Promise<
  Array<{
    id: string;
    userId: string;
    role: string;
    joinedAt: Date;
    leftAt: Date | null;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar: string | null;
    };
  }>
> {
  // Verify team exists and belongs to company
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      companyId,
      deletedAt: null,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  // Verify all users exist and belong to same company
  const users = await prisma.user.findMany({
    where: {
      id: { in: userIds },
      companyId,
      deletedAt: null,
    },
    select: { id: true },
  });

  if (users.length !== userIds.length) {
    throw new Error("One or more users not found or invalid");
  }

  // Check for existing memberships and add new ones
  const addedMembers = [];

  for (const userId of userIds) {
    // Check if user is already a member (including inactive)
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });

    if (existingMember && !existingMember.leftAt) {
      // User is already an active member, skip
      continue;
    }

    let member;
    if (existingMember && existingMember.leftAt) {
      // Reactivate membership
      member = await prisma.teamMember.update({
        where: { id: existingMember.id },
        data: {
          leftAt: null,
          joinedAt: new Date(), // Reset join date
        },
        select: {
          id: true,
          userId: true,
          role: true,
          joinedAt: true,
          leftAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
        },
      });
    } else {
      // Create new membership
      member = await prisma.teamMember.create({
        data: {
          teamId,
          userId,
          role: "EMPLOYEE", // Default role
        },
        select: {
          id: true,
          userId: true,
          role: true,
          joinedAt: true,
          leftAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
        },
      });
    }

    addedMembers.push(member);
  }

  return addedMembers;
}

/**
 * Remove a member from a team (soft delete by setting leftAt)
 */
export async function removeTeamMember(
  companyId: string,
  teamId: string,
  memberId: string
): Promise<void> {
  // Verify team exists and belongs to company
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      companyId,
      deletedAt: null,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  // Find the team member
  const member = await prisma.teamMember.findFirst({
    where: {
      id: memberId,
      teamId,
      leftAt: null, // Only active members
    },
  });

  if (!member) {
    throw new Error("Member not found");
  }

  // Set leftAt to current timestamp (soft delete)
  await prisma.teamMember.update({
    where: { id: memberId },
    data: {
      leftAt: new Date(),
    },
  });
}

/**
 * UTILITY
 */
/**
 * Check if user is member of team
 */
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

/**
 * Check if user has access to team (admin or member)
 */
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
