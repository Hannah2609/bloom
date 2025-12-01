import { Role } from '@/generated/prisma/enums';
import { SessionOptions, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

// henter secret session key fra .env
const secretKey = process.env.SESSION_SECRET;

export interface PendingCompanySetup {
  companyId: string;
  role: Role;
  email?: string;
}

export interface SessionData {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
    role: Role;
    companyId: string | null;
    company: {
      id: string;
      name: string;
      logo?: string | null;
    };
  };
  isLoggedIn?: boolean;
  pendingCompany?: PendingCompanySetup;
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
      avatar?: string | null;
      role: Role;
      companyId: string | null;
      company: {
        id: string;
        name: string;
        logo?: string | null;
      }
    };
    isLoggedIn?: boolean;
    pendingCompany?: PendingCompanySetup;
  }
}

// Funktion til at hente session
export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
