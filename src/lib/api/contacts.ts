import { api, ServerApi } from '@/lib/axios';
import type { ProfileData } from '@/types/profile';
import type { Contact } from '@/types/contact';
import { withServerCookies } from '@/utils/withServerCookies';

export const getContacts = async (profileId: string | null): Promise<Contact[]> => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }

        const response = await ServerApi.get(`/profile/${profileId}/contacts`, { headers });

        console.log("conatcts:::::::::::::::::::", response.data);
        return response.data;
    } catch (error) {
        console.error('Profile fetch error:', error);
        throw error;
    }
};


// export const getContacts = async (profileId: string | null): Promise<Contact[]> => {
//     try {
//         if (!profileId || typeof profileId !== 'string') {
//             throw new Error(`Invalid profileId: ${profileId}`);
//         }

//         const response = await axios.get(`http://localhost:3001/api/profile/${profileId}/contacts`, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             withCredentials: true, // still good to include
//         });

//         return response.data;
//     } catch (error) {
//         console.error('Profile fetch error:', error);
//         throw error;
//     }
// };

export const updateProfile = async (userId: string, profileData: Partial<ProfileData>): Promise<ProfileData> => {
    try {
        const response = await api.patch(`/profile/${userId}`, profileData);
        return response.data;
    } catch (error) {
        console.error('Profile update error:', error);
        throw error;
    }
};
