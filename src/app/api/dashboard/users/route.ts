import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();

    // Check if user is logged in and is admin
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Fetch all users in the same company
    const users = await prisma.user.findMany({
      where: {
        companyId: session.user.companyId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
