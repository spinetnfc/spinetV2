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

        // Log the contact data being sent
        console.log("Sending contact data:", JSON.stringify(contact, null, 2));

        // Log request details
        const requestUrl = `/profile/${profileId}/contacts`;
        console.log("Making POST request to:", requestUrl);

        const response = await ServerApi.post(requestUrl, contact, { headers });

        // Log successful response
        console.log("Contact added response received:", {
            status: response.status,
            statusText: response.statusText,
            data: JSON.stringify(response.data, null, 2),
        });

        return response.data;
    } catch (error: any) {
        // Enhanced error logging
        const errorDetails = {
            message: error.message,
            request: {
                url: `/profile/${profileId}/contacts`,
                headers: JSON.stringify(headers, null, 2), // Be cautious with sensitive headers
                body: JSON.stringify(contact, null, 2),
            },
            response: error.response
                ? {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: JSON.stringify(error.response.data, null, 2),
                }
                : "No response data available",
            stack: error.stack,
        };

        console.error("Error adding contact:", errorDetails);

        // Extract validation messages if available
        let validationMessages = "Unknown validation error";
        if (error.response?.data?.validations?.body) {
            validationMessages = error.response.data.validations.body
                .map((validation: any) => {
                    return `Property "${validation.property}": ${validation.messages.join(", ")}`;
                })
                .join("; ");
            console.log("Validation errors:", validationMessages);
        }

        // Create a new error with enriched details
        const enrichedError = new Error(
            error.response?.data?.message || validationMessages || "Failed to add contact"
        );
        enrichedError.name = error.name || "AxiosError";
        // enrichedError.response = error.response; // Preserve original response
        enrichedError.stack = error.stack;

        throw enrichedError;
    }
};

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

// export const deleteService = async (profileId: string, serviceId: string): Promise<{ message: string }> => {
//     if (!profileId || typeof profileId !== 'string') {
//         throw new Error(`Invalid profileId: ${profileId}`);
//     }
//     if (!serviceId || typeof serviceId !== 'string') {
//         throw new Error(`Invalid serviceId: ${serviceId}`);
//     }

//     const response = await api.delete(`/profile/${profileId}/service/${serviceId}`);
//     console.log("Service deleted response received:", response.status);

//     return response.data;
// }