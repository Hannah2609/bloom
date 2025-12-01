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

    // Rate limit DB checks (only check every 5 minutes)
    const shouldVerify = !session.lastVerified || 
      Date.now() - session.lastVerified > 5 * 60 * 1000;

    if (shouldVerify) {
      // Verify user still exists and is not deleted
      const userExists = await prisma.user.findUnique({
        where: { 
          id: session.user.id,
        },
        select: {
          id: true,
          deletedAt: true,
        },
      });

      // If user does not exist or is deleted, clear session
      if (!userExists || userExists.deletedAt) {
        session.destroy();
        return NextResponse.json({
          isLoggedIn: false,
          user: null,
        });
      }

      // Update verification timestamp
      session.lastVerified = Date.now();
      await session.save();
    }

    // Return session data
    return NextResponse.json({
      isLoggedIn: true,
      user: session.user,
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}