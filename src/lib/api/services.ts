import { cookies } from 'next/headers';
import { api, ServerApi } from '@/lib/axios';
import type { Service, ServiceInput } from '@/types/services';

export const getServices = async (profileId: string | null): Promise<Service[]> => {
    if (!profileId || typeof profileId !== 'string') {
        throw new Error(`Invalid profileId: ${profileId}`);
    }

    const cookieStore = await cookies();
    const session = cookieStore.get('spinet-session')?.value;

    if (!session) {
        throw new Error('Session cookie not found');
    }
    const response = await ServerApi.get(`/profile/${profileId}/services`, {
        headers: {
            Cookie: `spinet-session=${session}`, // send session manually
        },
        withCredentials: true,
    });
    console.log("Services response received:", response.status);

    return response.data;
};