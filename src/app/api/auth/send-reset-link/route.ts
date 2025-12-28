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
            "If an account exists with this email, you will receive a password reset link shortly.",
        },
        { status: 200 }
      );
    }

    const resetToken = crypto.randomUUID();
    const resetExpires = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetExpires,
      },
    });

    // Return relative path in development (easier for client-side routing)
    const resetPath = `/reset-password?token=${resetToken}`;

    return NextResponse.json(
      {
        message:
          "If an account exists with this email, you will receive a password reset link shortly.",
        resetLink:
          process.env.NODE_ENV === "development" ? resetPath : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset request error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
