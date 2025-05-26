import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const PUBLIC_PATHS = ["/", "/auth/login", "/auth/register", "/download-app"];
const AUTH_PATHS = ["/auth/refresh", "/auth/forgot-password"];
const SUPPORTED_LOCALES = ["en", "fr", "ar"];
const DEFAULT_LOCALE = "en";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameSegments = pathname.split("/");
  const currentLocale = pathnameSegments[1];

  // Skip middleware for API routes including auth refresh
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Handle locale routing
  if (!SUPPORTED_LOCALES.includes(currentLocale)) {
    // Get user's preferred locale from cookie or default to 'en'
    const preferredLocale = request.cookies.get("NEXT_LOCALE")?.value || DEFAULT_LOCALE;
    const response = NextResponse.redirect(
      new URL(`/${preferredLocale}${pathname}`, request.url)
    );
    response.cookies.set("NEXT_LOCALE", preferredLocale);
    return response;
  }

  // Get path without locale for route checking
  const pathWithoutLocale = pathname.slice(`/${currentLocale}`.length) || '/';

  // Skip auth check for auth-related routes
  if (AUTH_PATHS.some(path => pathWithoutLocale.includes(path))) {
    return NextResponse.next();
  }

  // Check if it's a public route
  const isPublicRoute = PUBLIC_PATHS.some(path => pathWithoutLocale.includes(path));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for session
  const session = request.cookies.get("spinet-session");
  if (!session) {
    return NextResponse.redirect(
      new URL(`/${currentLocale}/auth/login`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|images|favicon.ico|.*\\.[\\w]+$).*)'
  ]
};