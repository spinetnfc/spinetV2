export function getLocale(): string | undefined {
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const pathLocale = pathname.split("/")[1]; // first segment after /

    if (pathLocale && /^[a-z]{2}(-[A-Z]{2})?$/.test(pathLocale)) {
        return pathLocale;
    }
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; NEXT_LOCALE=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return "en";
}
