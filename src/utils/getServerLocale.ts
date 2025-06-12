import { cookies } from 'next/headers';

export async function getServerCookie(): Promise<string | undefined> {
    const cookieStore = await cookies();
    if (cookieStore.has("NEXT_LOCALE")) {
        return cookieStore.get("NEXT_LOCALE")?.value;
    }
    return "en";
}
