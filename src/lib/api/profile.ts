import api from '@/lib/axios';

export interface ProfileData {
    type: string;
    groupId: string;
    theme: {
        color: string;
    };
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
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

export const getProfile = async (userId: string): Promise<ProfileData> => {
    try {
        console.log('Fetching profile for userId:', userId);
        
        // Make sure userId is a valid string
        if (!userId || typeof userId !== 'string') {
            throw new Error(`Invalid userId: ${userId}`);
        }
        
        // Construct URL path carefully
        const url = `/user/${encodeURIComponent(userId)}/profiles`;
        console.log('Request URL:', url);
        
        // Make the actual API call - NO MOCK DATA
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Profile fetch error:', error);
        
        // Additional debugging
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            
            // Check for axios error properties
            const axiosError = error as any;
            if (axiosError.config) {
                console.error('Request config:', axiosError.config);
            }
            if (axiosError.response) {
                console.error('Response status:', axiosError.response.status);
                console.error('Response data:', axiosError.response.data);
            }
        }
        
        throw error;
    }
};

export const updateProfile = async (userId: string, profileData: Partial<ProfileData>): Promise<ProfileData> => {
    try {
        const response = await api.put(`/profile/${userId}`, profileData);
        return response.data;
    } catch (error) {
        console.error('Profile update error:', error);
        throw error;
    }
};
