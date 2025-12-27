import { NextResponse, type NextRequest } from "next/server";
import { SessionData, sessionOptions } from "./lib/session/session";
import { getIronSession } from "iron-session";

// Routes from (auth) folder - no authentication required
// Using startsWith() so /signup matches both /signup and /signup/company
const authRoutes = ["/login", "/signup"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session from cookies
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(
    request,
    response,
    sessionOptions
  );

  // Check if user is actually logged in (has user object, not just pending company)
  const isLoggedIn = !!session.user?.id;

  // whitelist logic
  // Public routes - accessible to everyone
  const isPublic = pathname === "/";

  // Auth routes - accessible to unauthenticated users
  const isAuth = authRoutes.some((route) => pathname.startsWith(route));

  // Everything else requires authentication (all (dashboard) routes)
  const isProtected = !isPublic && !isAuth;

  // Redirect unauthenticated users from protected pages to login
  if (isProtected && !isLoggedIn) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Run proxy on all routes except API routes (has own auth) and static files
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
