import { NextResponse } from "next/server";
import { prisma as prismaClient } from "@/lib/prisma";
import { companySignupSchema } from "@/lib/validation/validation";
import { z } from "zod";
import { Prisma as PrismaError } from "@prisma/client";
import { getSession } from "@/lib/session/session";
import { Role } from "@/types/user";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body
    const validatedData = companySignupSchema.parse(body);

    // Create the company
    const company = await prismaClient.company.create({
      data: {
        name: validatedData.companyName,
        domain: validatedData.companyDomain,
        logo: validatedData.logo,
      },
    });

    const session = await getSession();
    session.pendingCompany = {
      companyId: company.id,
      role: "ADMIN" as Role,
    };
    await session.save();

    return NextResponse.json(
      {
        company,
        message: "Company created successfully",
        redirectUrl: `/signup/company/${company.id}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Company signup error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    // Error handling for catching existing company
    if (error instanceof PrismaError.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "A company with this domain already exists" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
