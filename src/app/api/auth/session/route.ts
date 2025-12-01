import { getSession } from '@/lib/session/session';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();

    // Check if session has user data
    if (!session.user) {
      return NextResponse.json({
        isLoggedIn: false,
        user: null,
      });
    }

    // Fetch minimal user data to verify user still exists and is not deleted
    const userExists = await prisma.user.findFirst({
      where: { 
        id: session.user.id,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    // If user does not exist or is deleted, clear session
    if (!userExists) {
      session.destroy();
      return NextResponse.json({
        isLoggedIn: false,
        user: null,
      });
    }

    // Return session data (company comes from session set at login)
    return NextResponse.json({
      isLoggedIn: true,
      user: session.user,
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}