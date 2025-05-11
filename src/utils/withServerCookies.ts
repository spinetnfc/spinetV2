import { cookies } from 'next/headers';

export const withServerCookies = async () => {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const sessionCookie = allCookies.find((cookie) => cookie.name === 'spinet-session');
    const sessionSig = allCookies.find((cookie) => cookie.name === 'spinet-session.sig');

    if (!sessionCookie || !sessionSig) {
        throw new Error('Missing authentication cookies');
    }

    return {
        Cookie: `spinet-session=${sessionCookie.value}; spinet-session.sig=${sessionSig.value}`,
    };
};
