
export function getLocale(): string {
    // get locale from URL:  /[locale]/...
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const pathLocale = pathname.split("/")[1]; // first segment after /

    if (pathLocale && /^[a-z]{2}(-[A-Z]{2})?$/.test(pathLocale)) {
        return pathLocale;
    }

    // fallback to reading NEXT_LOCALE cookie
    const cookieMatch = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);
    if (cookieMatch) {
        return cookieMatch[1];
    }

    return "en"; // fallback default locale
}
