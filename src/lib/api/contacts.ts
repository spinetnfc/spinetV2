import { api, ServerApi } from '@/lib/axios';
import type { Contact, ContactInput } from '@/types/contact';
import { withServerCookies } from '@/utils/withServerCookies';

export const getContacts = async (profileId: string | null): Promise<Contact[]> => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        const response = await ServerApi.get(`/profile/${profileId}/contacts`, { headers });
        // console.log("conatcts:::::::::::::::::::", response.data);
        return response.data;
    } catch (error) {
        console.error('Profile fetch error:', error);
        throw error;
    }
};


export const addContact = async (profileId: string, contact: ContactInput): Promise<{ message: string }> => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        console.log("contact:::::::::::::::::::", JSON.stringify(contact, null, 2));
        const response = await ServerApi.post(`/profile/${profileId}/contacts`, contact, { headers });
        console.log("Contact added response received:", response.status);

        return response.data;
    } catch (error) {
        console.error('Error adding contact:', error);
        throw error;
    }
}

// export const updateService = async (profileId: string, serviceId: string, service: ServiceInput): Promise<{ message: string }> => {
//     if (!profileId || typeof profileId !== 'string') {
//         throw new Error(`Invalid profileId: ${profileId}`);
//     }
//     if (!serviceId || typeof serviceId !== 'string') {
//         throw new Error(`Invalid serviceId: ${serviceId}`);
//     }

//     const response = await api.patch(`/profile/${profileId}/service/${serviceId}`, service);
//     console.log("Service updated response received:", response.status);

//     return response.data;
// }

export const deleteService = async (profileId: string, contactId: string): Promise<{ message: string }> => {
    if (!profileId || typeof profileId !== 'string') {
        throw new Error(`Invalid profileId: ${profileId}`);
    }
    if (!contactId || typeof contactId !== 'string') {
        throw new Error(`Invalid contactId: ${contactId}`);
    }

    const response = await ServerApi.delete(`/profile/${profileId}/contact/${contactId}`);
    console.log("Service deleted response received:", response.status);

    return response.data;
}