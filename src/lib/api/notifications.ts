import { ServerApi } from '@/lib/axios';
import { withServerCookies } from '@/utils/withServerCookies';
import type { NotificationFilters } from '@/types/notifications';

export const getNotifications = async (profileId: string, filters: NotificationFilters) => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        const response = await ServerApi.post(`/profile/${profileId}/notifications/filter`, { filters }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
}

export const getInvitations = async (profileId: string, filters: { limit: string, skip: string }) => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        const response = await ServerApi.post(`/profile/${profileId}/invitations`, { filters }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching invitations:', error);
        throw error;
    }
}