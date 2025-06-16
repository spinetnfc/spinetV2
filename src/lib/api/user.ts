import { cookies } from 'next/headers';
import { ServerApi } from '../axios';
import type { User } from '@/types/user';
import { withServerCookies } from '@/utils/withServerCookies';

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

export const updateUser = async (userId: string, user: Partial<User>) => {
    if (!userId || typeof userId !== 'string') {
        throw new Error(`Invalid userId: ${userId}`);
    }

    const headers = await withServerCookies();
    try {
        const response = await ServerApi.patch(`/user/${userId}`, user, { headers });
        return response.data;
    } catch (error) {
        console.error(`Failed to update user ${userId}:`, error);
        throw error;
    }
}

