import { api, ServerApi } from '@/lib/axios';
import type { ProfileData } from '@/types/profile';
import type { Contact } from '@/types/contact';

export const getContacts = async (profileId: string | null): Promise<Contact[]> => {
    try {
        // Make sure userId is a valid string
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        // Use proper URL format
        const response = await ServerApi.get(`/profile/${profileId}/contacts`);
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
