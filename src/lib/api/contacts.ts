"use server"

import { api, ServerApi } from '@/lib/axios';
import type { ProfileData } from '@/types/profile';
import type { Contact } from '@/types/contact';
import { cookies } from 'next/headers';



export const getContacts = async (profileId: string | null): Promise<Contact[]> => {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const sessionCookie = allCookies.find((cookie) => cookie.name === 'spinet-session');
    const sessionSig = allCookies.find((cookie) => cookie.name === 'spinet-session.sig');

    if (!sessionCookie || !sessionSig) {
        throw new Error('Missing authentication cookies');
    }

    const cookieHeader = `spinet-session=${sessionCookie.value}; spinet-session.sig=${sessionSig.value}`;

    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }

        const response = await ServerApi.get(`/profile/${profileId}/contacts`, {
            headers: {
                Cookie: cookieHeader,
            },
        });

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
