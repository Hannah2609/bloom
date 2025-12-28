import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import { searchTeams } from "@/lib/queries/teams";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    // search for teams query function
    const teams = await searchTeams(session.user.companyId, query);

    return NextResponse.json({ teams });
  } catch (error) {
    console.error("Error searching teams:", error);
    return NextResponse.json(
      { error: "Failed to search teams" },
      { status: 500 }
    );
  }
}
