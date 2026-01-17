import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation/validation";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = forgotPasswordSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: "Invalid email address",
          details: validatedData.error.issues,
        },
        { status: 400 }
      );
    }

    const { email } = validatedData.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, you will receive a verification link shortly.",
        },
        { status: 200 }
      );
    }

    // Check if already verified
    if (user.verifiedAt) {
      return NextResponse.json(
        {
          message: "This email is already verified.",
        },
        { status: 200 }
      );
    }

    const verificationToken = crypto.randomUUID();
    const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpires,
      },
    });

    // Return relative path in development (easier for client-side routing)
    const verificationPath = `/verify-email?token=${verificationToken}`;

    return NextResponse.json(
      {
        message:
          "If an account exists with this email, you will receive a verification link shortly.",
        verificationLink:
          process.env.NODE_ENV === "development" ? verificationPath : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification request error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

