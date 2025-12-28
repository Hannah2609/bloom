import { getSession } from "@/lib/session/session";
import { NextResponse } from "next/server";
import { searchUsersForTeam } from "@/lib/queries/teams";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId } = await params;
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    // Search users for team query
    const users = await searchUsersForTeam(
      session.user.companyId,
      teamId,
      query
    );

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error searching users:", error);

    if (error instanceof Error && error.message === "Team not found") {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
