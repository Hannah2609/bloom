import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const addMembersSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1, "At least one user is required"),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id: teamId } = await params;
    const body = await request.json();
    const validatedData = addMembersSchema.parse(body);

    // Verify team exists and belongs to company
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        companyId: session.user.companyId,
        deletedAt: null,
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Verify all users exist and belong to same company
    const users = await prisma.user.findMany({
      where: {
        id: { in: validatedData.userIds },
        companyId: session.user.companyId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (users.length !== validatedData.userIds.length) {
      return NextResponse.json(
        { error: "One or more users not found or invalid" },
        { status: 400 }
      );
    }

    // Check for existing memberships and add new ones
    const addedMembers = [];

    for (const userId of validatedData.userIds) {
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

    return NextResponse.json(
      {
        message: `Successfully added ${addedMembers.length} member(s)`,
        members: addedMembers,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error adding members:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
