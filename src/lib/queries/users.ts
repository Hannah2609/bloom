import { prisma } from "@/lib/prisma";
import { Role } from "@/types/user";

/**
 * GET
 */
/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      deletedAt: true,
      verifiedAt: true,
    },
  });
}

/**
 * Get user by email with company
 */
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
  });
}

/**
 * Check if user exists by email
 */
export async function userExistsByEmail(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return !!user;
}

/**
 * Get user by ID with company for profile page where info changes are allowed
 */
export async function getUserWithCompanyById(userId: string) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
      deletedAt: null,
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
  });
}

/**
 * Check if user exists in company (for authorization checks)
 */
export async function getUserInCompany(userId: string, companyId: string) {
  return await prisma.user.findFirst({
    where: {
      id: userId,
      companyId,
      deletedAt: null,
    },
  });
}

/**
 * Soft delete a user
 */
export async function softDeleteUser(userId: string) {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

/**
 * POST
 */
/**
 * Create a new user
 */
export async function createUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  companyId: string;
}) {
  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role,
      companyId: data.companyId,
    },
  });

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    companyId: user.companyId,
    createdAt: user.createdAt,
  };
}
