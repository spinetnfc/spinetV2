export function getUserFromCookie() {
    const cookieString = document.cookie
        .split('; ')
        .find(row => row.startsWith('current-user='));
    if (!cookieString) return null;

    try {
        const json = decodeURIComponent(cookieString.split('=')[1]);
        return JSON.parse(json);
    } catch (err) {
        console.error('Failed to parse user cookie:', err);
        return null;
    }
}