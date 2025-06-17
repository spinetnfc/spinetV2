export function getLocale(): string | undefined {
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const pathLocale = pathname.split("/")[1];

    if (pathLocale === "ar" || pathLocale === "fr" || pathLocale === "en") {
        return pathLocale;
    }
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; NEXT_LOCALE=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return "en";
}