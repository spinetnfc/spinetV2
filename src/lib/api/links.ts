import { ServerApi } from '@/lib/axios';
import { withServerCookies } from '@/utils/withServerCookies';
import type { LinkType } from '@/types/profile';

export const addLinks = async (profileId: string, links: LinkType[]) => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        const response = await ServerApi.post(`/profile/${profileId}/links`, { links }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error adding links:', error);
        throw error;
    }
}