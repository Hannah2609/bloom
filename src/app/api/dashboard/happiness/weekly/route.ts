import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import { getWeeklyHappinessAnalytics } from "@/lib/queries/happiness";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const weeks = parseInt(searchParams.get("weeks") || "12");
    const teamId = searchParams.get("teamId") || undefined;
    const companyLevel = searchParams.get("companyLevel") === "true";
    const viewType = (searchParams.get("viewType") || "weekly") as
      | "weekly"
      | "monthly";

    const data = await getWeeklyHappinessAnalytics(session.user.companyId, {
      weeks,
      teamId,
      companyLevel,
      viewType,
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching weekly happiness analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
