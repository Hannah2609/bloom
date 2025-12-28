import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateTokenSchema } from "@/lib/validation/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = validateTokenSchema.parse(body);

    // Find user with valid token and non-expired reset
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
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

    return NextResponse.json({ message: "Token is valid" }, { status: 200 });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
