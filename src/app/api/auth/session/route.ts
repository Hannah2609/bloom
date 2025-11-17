import { getSession } from '@/lib/session/session';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// API endpoint der returnerer den aktuelle session status
export async function GET() {
  try {
    const session = await getSession();

    // Tjek om session har user data
    if (!session.user) {
      return NextResponse.json({
        isLoggedIn: false,
        user: null,
      });
    }

    // Fetch fresh user data from the database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        companyId: true,
      },
    });

    // Tjek om user stadig eksisterer i db
    if (!user) {
      return NextResponse.json({
        isLoggedIn: false,
        user: null,
      });
    }

    // Update session with fresh data
    session.user = user;
    await session.save();

    return NextResponse.json({
      isLoggedIn: true,
      user,
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
