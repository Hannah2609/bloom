import { NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import { z } from "zod";
import { setPendingCompanySchema } from "@/lib/validation/validation";
import { getCompanyById } from "@/lib/queries/companies";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyId, role, email } = setPendingCompanySchema.parse(body);

    // Verify company exists
    const company = await getCompanyById(companyId);

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const session = await getSession();
    session.pendingCompany = {
      companyId,
      role,
      email,
    };
    await session.save();

    return NextResponse.json({
      message: "Pending company set successfully",
    });
  } catch (error) {
    console.error("Set pending company error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
