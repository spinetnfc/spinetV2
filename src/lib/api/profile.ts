import { api, ServerApi } from '@/lib/axios';

export interface ProfileData {
    type: string;
    groupId: string;
    theme: {
        color: string;
    };
    firstName?: string;
    fullName: string;
    lastName?: string;
    birthDate: string;
    gender: string;
    phoneNumber?: string;
    companyName: string;
    activitySector: string;
    position: string;
    profilePicture: string;
    profileCover: string;
    links: {
        title: string;
        link: string;
        name: string;
    }[];
    lockedFeatures: {
        profileCover: boolean;
        logo: boolean;
        qrCodeLogo: boolean;
        displayLogo: boolean;
        companyName: boolean;
        activitySector: boolean;
        position: boolean;
        theme: boolean;
        canAddLinks: boolean;
        canAddServices: boolean;
        excludedLinks: string[];
        firstName?: boolean;
        lastName?: boolean;
        birthDate?: boolean;
        gender?: boolean;
    };
}

export const getProfile = async (userId: string | null): Promise<ProfileData> => {
    try {
        // console.log('Fetching profile for userId:', userId);

        // Make sure userId is a valid string
        if (!userId || typeof userId !== 'string') {
            throw new Error(`Invalid userId: ${userId}`);
        }
        // Use proper URL format
        const response = await ServerApi.get(`/profile/${userId}`);
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
