import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '../i18n-config';
import type { I18nConfig } from '../i18n-config';

function getLocale(request: NextRequest, i18nConfig: I18nConfig): string {
  const { locales, defaultLocale } = i18nConfig;

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  return match(languages, locales, defaultLocale);
}

export async function middleware(request: NextRequest) {
  let response;
  let nextLocale;

  const { locales, defaultLocale } = i18n;
  const { basePath, pathname } = request.nextUrl;

  const pathLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.includes('favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Handle locale detection and redirection
  if (pathLocale) {
    const isDefaultLocale = pathLocale === defaultLocale;
    if (isDefaultLocale) {
      let newPathWithoutLocale = pathname.slice(`/${pathLocale}`.length) || '/';
      if (request.nextUrl.search)
        newPathWithoutLocale += request.nextUrl.search;

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

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (static, images, APIs)
    '/((?!api|_next/static|_next/image|img|favicon.ico).*)',
  ],
};
