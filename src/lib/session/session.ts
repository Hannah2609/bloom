import { Role } from "@/generated/prisma/enums";
import { UserWithCompany } from "@/types/user";
import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";

// henter secret session key fra .env
const secretKey = process.env.SESSION_SECRET;

export interface PendingCompanySetup {
  companyId: string;
  role: Role;
  email?: string;
}

export interface SessionData {
  user?: UserWithCompany;
  isLoggedIn?: boolean;
  lastVerified?: number;
  pendingCompany?: PendingCompanySetup;
}

export const sessionOptions: SessionOptions = {
  password: secretKey as string,
  cookieName: "bloom-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// Udvid IronSessionData med vores brugerdata interface
declare module "iron-session" {
  interface IronSessionData {
    user?: UserWithCompany;
    isLoggedIn?: boolean;
    lastVerified?: number;
    pendingCompany?: PendingCompanySetup;
  }
}

// Funktion til at hente session
export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
