import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validation/validation";
import { hash } from "bcryptjs";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body
    const validatedData = resetPasswordSchema.parse(body);

    // Find user with valid token and non-expired reset
    const user = await prisma.user.findFirst({
      where: {
        resetToken: validatedData.token,
        resetExpires: {
          gt: new Date(), // Check if expiration is greater than now
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hash(validatedData.password, 12);

    // Update user's password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetExpires: null,
      },
    });

    return NextResponse.json(
      { message: "Password has been reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);

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
