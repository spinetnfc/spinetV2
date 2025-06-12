export function getLocale(): string | undefined {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; NEXT_LOCALE=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return "en";
}
