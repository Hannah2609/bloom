import { getSession } from "@/lib/session/session";
import { NextResponse } from "next/server";
import { addTeamMembers, removeTeamMember } from "@/lib/queries/teams";
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

    // Add members query function
    const addedMembers = await addTeamMembers(
      session.user.companyId,
      teamId,
      validatedData.userIds
    );

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

    if (error instanceof Error) {
      if (error.message === "Team not found") {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }
      if (error.message === "One or more users not found or invalid") {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Remove team member
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id: teamId } = await params;
    const body = await request.json();
    const { memberId } = body;

    if (!memberId) {
      return NextResponse.json(
        { error: "memberId is required" },
        { status: 400 }
      );
    }

    await removeTeamMember(session.user.companyId, teamId, memberId);

    return NextResponse.json(
      { message: "Member removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing member:", error);

    if (error instanceof Error) {
      if (error.message === "Team not found") {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }
      if (error.message === "Member not found") {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
