import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { signupSchema } from "@/lib/validation/validation";
import { z } from "zod";
import { Prisma as PrismaError } from "@/generated/prisma/client"; //TODO
import { getSession } from "@/lib/session/session";
import { Role } from "@/types/user";
import { createUser } from "@/lib/queries/users";
import crypto from "crypto";

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

    // Create the user using query function
    const sanitizedUser = await createUser({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      password: hashedPassword,
      role: userRole,
      companyId: userCompanyId,
    });

    // Generate verification token
    const verificationToken = crypto.randomUUID();
    const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    // Update user with verification token
    const { prisma } = await import("@/lib/prisma");
    await prisma.user.update({
      where: { id: sanitizedUser.id },
      data: {
        verificationToken,
        verificationTokenExpires,
      },
    });

    if (pendingCompany) {
      delete session.pendingCompany;
      await session.save();
    }

    // Return relative path in development or production for now
    const verificationPath = `/verify-email?token=${verificationToken}`;

    return NextResponse.json(
      {
        user: sanitizedUser,
        message: "User created successfully",
        verificationLink:
          process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === "production"
            ? verificationPath
            : undefined,
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
