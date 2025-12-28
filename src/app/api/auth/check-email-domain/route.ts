import { NextResponse } from "next/server";
import { z } from "zod";
import { emailSchema } from "@/lib/validation/validation";
import { userExistsByEmail } from "@/lib/queries/users";
import { getCompanyByDomain } from "@/lib/queries/companies";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = emailSchema.parse(body);

    // Check if user already exists
    const userExists = await userExistsByEmail(email);

    if (userExists) {
      return NextResponse.json({
        userExists: true,
      });
    }

    // Extract domain from email
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if a company exists with this domain
    const company = await getCompanyByDomain(domain);

    if (company) {
      return NextResponse.json({
        hasCompany: true,
        company,
        redirectUrl: `/signup/company/${company.id}`,
      });
    }

    return NextResponse.json({
      hasCompany: false,
    });
  } catch (error) {
    console.error("Check email domain error:", error);

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
