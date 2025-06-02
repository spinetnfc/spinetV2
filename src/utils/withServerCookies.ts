"use server"
import { cookies } from 'next/headers';

export const withServerCookies = async () => {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const sessionCookie = allCookies.find((cookie) => cookie.name === 'spinet-session');
    const sessionSig = allCookies.find((cookie) => cookie.name === 'spinet-session.sig');
    const userCookie = allCookies.find((cookie) => cookie.name === 'current-user')?.value;

    if (sessionCookie && sessionSig) {
        return {
            Cookie: `spinet-session=${sessionCookie.value}; spinet-session.sig=${sessionSig.value}`,
        };
    }

    if (userCookie) {
        const user = JSON.parse(decodeURIComponent(userCookie));
        if (user.googleId) {
            return {
                Cookie: `googleId=${user.googleId}`,
            };
        }
    }

    throw new Error('Missing authentication cookies');
};