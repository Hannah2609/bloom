import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session/session";
import { NextResponse } from "next/server";
import { editProfileAvatarSchema, editProfileNameSchema } from "@/lib/validation/validation";

// Update user profile
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Users can only edit their own profile
    if (session.user.id !== id) {
      return NextResponse.json(
        { error: "You can only edit your own profile" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Check if it's an avatar update or name update
    const isAvatarUpdate =
      "avatar" in body && !("firstName" in body || "lastName" in body);

    let validatedData;

    if (isAvatarUpdate) {
      // Validate as avatar update
      const result = editProfileAvatarSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          {
            error: "Validation error",
            details: result.error.issues,
          },
          { status: 400 }
        );
      }
      validatedData = result.data;
    } else {
      // Validate as name update
      const result = editProfileNameSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          {
            error: "Validation error",
            details: result.error.issues,
          },
          { status: 400 }
        );
      }
      validatedData = result.data;
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        id,
        companyId: session.user.companyId,
      },
      data: validatedData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        user: updatedUser,
        message: "Profile updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);

    // Handle Prisma errors
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// Delete user by ID (soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    // Check if user is logged in and is admin
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Prevent user from deleting themselves
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Check if target user exists and belongs to same company
    const targetUser = await prisma.user.findFirst({
      where: {
        id,
        companyId: session.user.companyId,
        deletedAt: null,
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Soft delete user
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
