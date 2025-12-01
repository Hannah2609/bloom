import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { emailSchema } from "@/lib/validation/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = emailSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
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
    const company = await prisma.company.findUnique({
      where: { domain },
      select: { id: true, name: true, domain: true },
    });

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

