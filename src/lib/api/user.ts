import { cookies } from 'next/headers';
import { ServerApi } from '../axios';
import type { User } from '@/types/user';

export const getUser = async (userId: string | null): Promise<User> => {
    if (!userId || typeof userId !== 'string') {
        throw new Error(`Invalid userId: ${userId}`);
    }

    const cookieStore = await cookies();
    const session = cookieStore.get('spinet-session')?.value;

    if (!session) {
        throw new Error('Session cookie not found');
    }

    const response = await ServerApi.get(`/user/${userId}`, {
        headers: {
            Cookie: `spinet-session=${session}`, // send session manually
        },
        withCredentials: true,
    });

    return response.data;
};
