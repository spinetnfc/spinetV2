import { api, ServerApi } from '@/lib/axios';
import type { ProfileData } from '@/types/profile';
import type { Contact } from '@/types/contact';
import { cookies } from 'next/headers';



export const getContacts = async (profileId: string | null): Promise<Contact[]> => {
    const cookieStore = await cookies();
    const session = cookieStore.get('spinet-session')?.value;
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        const headers = {
            Cookie: `spinet-session=${session}`,
        };

        // console.log('Request Headers:', headers);

        const response = await ServerApi.get(`/profile/${profileId}/contacts`, {
            headers,
            withCredentials: true,
        });
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

export const updateProfile = async (userId: string, profileData: Partial<ProfileData>): Promise<ProfileData> => {
    try {
        const response = await api.patch(`/profile/${userId}`, profileData);
        return response.data;
    } catch (error) {
        console.error('Profile update error:', error);
        throw error;
    }
};
