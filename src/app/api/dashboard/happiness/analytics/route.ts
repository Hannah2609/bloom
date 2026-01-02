import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import { getHappinessAnalytics } from "@/lib/queries/happiness";

// Get aggregated happiness analytics (admin only)
// Returns completely anonymous team-level data
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const weeks = parseInt(searchParams.get("weeks") || "12");

    const data = await getHappinessAnalytics(session.user.companyId, weeks);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching happiness analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
