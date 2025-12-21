import { Role } from "@/types/user";
import { UserWithCompany } from "@/types/user";
import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";

// henter secret session key fra .env
const secretKey = process.env.SESSION_SECRET;

if (!secretKey) {
  throw new Error(
    "SESSION_SECRET environment variable is required. Please set it in your .env file."
  );
}

export interface PendingCompanySetup {
  companyId: string;
  role: Role;
  email?: string;
}

export interface SessionData {
  user: UserWithCompany;
  isLoggedIn: boolean;
  lastVerified?: number;
  pendingCompany?: PendingCompanySetup;
}

export const sessionOptions: SessionOptions = {
  password: secretKey,
  cookieName: "bloom-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

// Udvid IronSessionData med vores brugerdata interface
declare module "iron-session" {
  interface IronSessionData {
    user: UserWithCompany;
    isLoggedIn: boolean;
    lastVerified?: number;
    pendingCompany?: PendingCompanySetup;
  }
}

// Funktion til at hente session
export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
