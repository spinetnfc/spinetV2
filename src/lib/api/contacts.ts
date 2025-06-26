import { ServerApi } from '@/lib/axios';
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

export const updateContact = async (profileId: string, contactId: string, contact: ContactInput): Promise<{ message: string }> => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        console.log("contact:::::::::::::::::::", JSON.stringify(contact, null, 2));
        const response = await ServerApi.patch(`/profile/${profileId}/contact/${contactId}`, contact, { headers });
        console.log("Contact updated, response received:", response.status);
        return response.data;
    } catch (error: any) {
        console.error("Error updating contact:", {
            message: error.message,
            response: error.response
                ? {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data,
                }
                : "No response data available",
            stack: error.stack,
        });
        // Log validations separately to avoid truncation
        if (error.response?.data?.validations) {
            console.error("Validation errors:", error.response.data.validations);
        }
        throw error;
    }
};

export const deleteContact = async (profileId: string, contactId: string): Promise<{ message: string }> => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        if (!contactId || typeof contactId !== 'string') {
            throw new Error(`Invalid contactId: ${contactId}`);
        }
        const response = await ServerApi.delete(`/profile/${profileId}/contact/${contactId}`, { headers });
        console.log("Contact deleted response received:", response.status);

        return response.data;
    } catch (error) {
        console.error('Error deleting contact:', error);
        throw error;
    }
}
export const deleteContacts = async (profileId: string, contacts: string[]): Promise<{ message: string }> => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        if (contacts.length === 0) {
            throw new Error(`no contacts to delete`);
        }
        const response = await ServerApi.post(`/profile/${profileId}/contacts/delete`, contacts, { headers });
        console.log("Contacts deleted response received:", response.status);

        return response.data;
    } catch (error) {
        console.error('Error deleting contacts:', error);
        throw error;
    }
}

export const sendInvitation = async (profileId: string, invite: any): Promise<{ message: string }> => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        console.log("invite:::::::::::::::::::", JSON.stringify(invite, null, 2));
        const response = await ServerApi.post(`/profile/${profileId}/invitations/invite`, invite, { headers });
        console.log("Invitation sent response received:", response.status);

        return response.data;
    } catch (error) {
        console.error('Error sending invitation:', error);
        throw error;
    }
}
