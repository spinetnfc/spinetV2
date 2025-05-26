import { api, ServerApi } from '@/lib/axios';
import type { ProfileData } from '@/types/profile';
import { withServerCookies } from '@/utils/withServerCookies';

export const viewProfile = async (profileId: string | null, userId: string | null): Promise<ProfileData> => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        if (!userId || typeof userId !== 'string') {
            throw new Error(`Invalid userId: ${userId}`);
        }
        const response = await ServerApi.get(`/profile/${profileId}/view/${userId}`, { headers });
        return response.data;
    } catch (error) {
        console.error('Profile fetch error:', error);
        throw error;
    }
};

export const getProfile = async (profileId: string | null): Promise<ProfileData> => {
    try {

        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        const response = await ServerApi.get(`/profile/${profileId}`);
        return response.data;
    } catch (error) {
        console.error('Profile fetch error:', error);
        throw error;
    }
};

export const updateProfile = async (userId: string, profileData: Partial<ProfileData>): Promise<ProfileData> => {
    try {
        const response = await api.patch(`/profile/${userId}`, profileData);
        return response.data;
    } catch (error) {
        console.error('Profile update error:', error);
        throw error;
    }
};
