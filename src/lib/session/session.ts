import { Role } from '@/generated/prisma/enums';
import { SessionOptions, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

// henter secret session key fra .env
const secretKey = process.env.SESSION_SECRET;

export interface SessionData {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role: Role;
    companyId?: string;
  };
  isLoggedIn?: boolean;
}

export const sessionOptions: SessionOptions = {
  password: secretKey as string,
  cookieName: 'bloom-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

// Udvid IronSessionData med vores brugerdata interface
declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar?: string;
      role: Role;
      companyId?: string;
    };
    isLoggedIn?: boolean;
  }
}

// Funktion til at hente session
export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
