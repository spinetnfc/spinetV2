import { ServerApi } from '@/lib/axios';
import type { ProfileData, profileInput } from '@/types/profile';
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

export const getAllProfiles = async (userId: string | null): Promise<ProfileData[]> => {
    const headers = await withServerCookies();
    try {
        if (!userId || typeof userId !== 'string') {
            throw new Error(`Invalid userId: ${userId}`);
        }
        const response = await ServerApi.get(`/user/${userId}/profiles`, { headers });
        return response.data;
    } catch (error) {
        console.error('Profiles fetch error:', error);
        throw error;
    }
}

export const createProfile = async (userId: string, profile: profileInput): Promise<profileInput> => {
    const headers = await withServerCookies();
    try {
        if (!userId || typeof userId !== "string") {
            throw new Error("Invalid userId:" + userId);
        }
        console.log('Creating profile :', profile);
        const response = await ServerApi.post(`/user/${userId}/profiles`, profile, { headers })
        console.log('Create profile response:', JSON.stringify(response.data, null, 2));

        return response.data;
    } catch (error) {
        console.error('Profile creation error:', error);
        throw error;
    }
}

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
    const headers = await withServerCookies();
    try {
        const response = await ServerApi.patch(`/profile/${userId}`, profileData, { headers });
        return response.data;
    } catch (error) {
        console.error('Profile update error:', error);
        throw error;
    }
};


export const deleteProfile = async (profileId: string): Promise<ProfileData> => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        const response = await ServerApi.delete(`/profile/${profileId}`, { headers });
        return response.data;
    } catch (error) {
        console.error('Profile deletion error:', error);
        throw error;
    }
}
