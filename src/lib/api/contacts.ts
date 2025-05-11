// import { api, ServerApi } from '@/lib/axios';
import type { ProfileData } from '@/types/profile';
import type { Contact } from '@/types/contact';
import { serverApiWithCookies } from '../api-client';


export const getContacts = async (profileId: string | null): Promise<Contact[]> => {
    const api = await serverApiWithCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        const response = await api.get(`/profile/${profileId}/contacts`);

        console.log(response.data);
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

// export const updateProfile = async (userId: string, profileData: Partial<ProfileData>): Promise<ProfileData> => {
//     try {
//         const response = await api.patch(`/profile/${userId}`, profileData);
//         return response.data;
//     } catch (error) {
//         console.error('Profile update error:', error);
//         throw error;
//     }
// };
