import { NextResponse, type NextRequest } from "next/server";

// Routes from (auth) folder - no authentication required
const authRoutes = ["/login", "/signup", "/signup-company"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = !!request.cookies.get("bloom-session")?.value;

  // whitelist logic
  // Public routes - accessible to everyone
  const isPublic = pathname === "/";

  // Auth routes - accessible only when logged out
  const isAuth = authRoutes.some((route) => pathname.startsWith(route));

  // Everything else requires authentication (all (dashboard) routes)
  const isProtected = !isPublic && !isAuth;

  // Redirect logged-in users away from auth pages
  if (isAuth && isLoggedIn) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

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
