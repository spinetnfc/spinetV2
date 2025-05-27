import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '../i18n-config';
import type { I18nConfig } from '../i18n-config';

// Public routes that don't require authentication
const publicPaths = ['/', '/auth', '/public-profile', '/download-app'];

// Check if the path is a public route - improved to handle subpaths
function isPublicRoute(path: string): boolean {
  if (path === '/') return true;
  return publicPaths.some(publicPath => {
    // Handle exact matches and subpaths
    return path === publicPath || path.startsWith(`${publicPath}/`);
  });
}

function getLocale(request: NextRequest, i18nConfig: I18nConfig): string {
  const { locales, defaultLocale } = i18nConfig;

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  return match(languages, locales, defaultLocale);
}

// Function to attempt token refresh
async function attemptTokenRefresh(request: NextRequest): Promise<boolean> {
  try {
    // First check if the user is logged in by checking for the current-user cookie
    const userCookie = request.cookies.get('current-user')?.value;
    if (!userCookie) {
      return false;
    }

    // Get the refresh token from cookies
    const refreshToken = request.cookies.get('fileApiRefreshToken')?.value;

    if (!refreshToken) {
      return false;
    }

    // Make a request to the refresh token endpoint
    const response = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    if (data.success) {
      // Get the user data from the current-user cookie
      try {
        const user = JSON.parse(decodeURIComponent(userCookie));

        // Update cookies with new tokens
        const response = NextResponse.next();

        // Set the new file API tokens
        response.cookies.set('fileApiToken', user.tokens.fileApiToken, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          sameSite: 'lax',
        });

        response.cookies.set('fileApiRefreshToken', user.tokens.fileApiRefreshToken, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          sameSite: 'lax',
        });

        return true;
      } catch (error) {
        console.error('Error parsing user cookie:', error);
        return false;
      }
    }

    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  let response;
  let nextLocale;

  const { locales, defaultLocale } = i18n;

  const { basePath, pathname } = request.nextUrl;

  const pathLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // Extract the path without locale for route protection check
  const pathWithoutLocale = pathLocale
    ? pathname.slice(`/${pathLocale}`.length) || '/'
    : pathname;

  // Skip auth check for static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.includes('favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Check if this is a public route before continuing with locale handling
  const isPublic = isPublicRoute(pathWithoutLocale);

  // Handle locale detection and redirection
  if (pathLocale) {
    const isDefaultLocale = pathLocale === defaultLocale;
    if (isDefaultLocale) {
      let newPathWithoutLocale = pathname.slice(`/${pathLocale}`.length) || '/';
      if (request.nextUrl.search) newPathWithoutLocale += request.nextUrl.search;

      const url = basePath + newPathWithoutLocale;

      response = NextResponse.redirect(new URL(url, request.url));
    }

    nextLocale = pathLocale;
  } else {
    const isFirstVisit = !request.cookies.has('NEXT_LOCALE');

    const locale = isFirstVisit ? getLocale(request, i18n) : defaultLocale;

    let newPath = `/${locale}${pathname}`;
    if (request.nextUrl.search) newPath += request.nextUrl.search;

    const url = basePath + newPath;

    response =
      locale === defaultLocale
        ? NextResponse.rewrite(new URL(url, request.url))
        : NextResponse.redirect(new URL(url, request.url));
    nextLocale = locale;
  }

  if (!response) response = NextResponse.next();

  if (nextLocale) response.cookies.set('NEXT_LOCALE', nextLocale);

  // Authentication logic - only apply to protected routes
  if (!isPublic) {
    const token = request.cookies.get('current-user')?.value;

    if (!token) {
      // Check if we have a refresh token and try to refresh
      const refreshToken = request.cookies.get('fileApiRefreshToken')?.value;

      if (refreshToken) {
        // Attempt to refresh the token
        const refreshed = await attemptTokenRefresh(request);

        if (refreshed) {
          // If token refresh was successful, continue to the requested page
          return response;
        }
      }

      // If no refresh token or refresh failed, redirect to login
      const localePart = nextLocale || defaultLocale;
      const redirectUrl = new URL(`/${localePart}/auth/login`, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (static, images, APIs)
    '/((?!api|_next/static|_next/image|img|favicon.ico).*)',
  ],
};