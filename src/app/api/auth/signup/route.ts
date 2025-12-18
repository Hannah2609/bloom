import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma as prismaClient } from "@/lib/prisma";
import { signupSchema } from "@/lib/validation/validation";
import { z } from "zod";
import { Prisma as PrismaError } from "@/generated/prisma/client"; //TODO
import { getSession } from "@/lib/session/session";
import { Role } from "@/types/user";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body
    const validatedData = signupSchema.parse(body);

    // Hash the password
    const hashedPassword = await hash(validatedData.password, 12);

    const session = await getSession();
    const pendingCompany = session.pendingCompany;

    const userRole = pendingCompany?.role ?? ("EMPLOYEE" as Role);
    const userCompanyId = pendingCompany?.companyId;

    if (!userCompanyId) {
      return NextResponse.json({ error: "Company not found" }, { status: 400 });
    }

    // Create the user
    const user = await prismaClient.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: hashedPassword,
        role: userRole,
        companyId: userCompanyId, // Now TypeScript knows this is string, not undefined
      },
    });

    const sanitizedUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      companyId: user.companyId,
      createdAt: user.createdAt,
    };

    if (pendingCompany) {
      delete session.pendingCompany;
      await session.save();
    }

    return NextResponse.json(
      {
        user: sanitizedUser,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    // Error handling for catching existing user
    if (error instanceof PrismaError.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "An account with this email already exists" },
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
