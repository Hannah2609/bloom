import { getSession } from "@/lib/session/session";
import { NextResponse } from "next/server";
import { deleteTeam } from "@/lib/queries/teams";

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

    await deleteTeam(session.user.companyId, teamId);

    return NextResponse.json(
      { message: "Team deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting team:", error);

    if (error instanceof Error) {
      if (error.message === "Team not found") {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
