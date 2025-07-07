import { ServerApi } from '@/lib/axios';
import type { Lead, LeadFilters, LeadInput } from '@/types/leads';
import { withServerCookies } from '@/utils/withServerCookies';

export const filterLeads = async (profileId: string | null, filters: LeadFilters): Promise<{data:Lead[]}> => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        const response = await ServerApi.post(`/profile/${profileId}/opportunities/filter`, filters, { headers });
        return response.data;
    } catch (error) {
        console.error('Leads fetch error:', error);
        throw error;
    }
};

export const getLead = async (profileId: string | null, leadId: string): Promise<Lead> => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        const response = await ServerApi.get(`/profile/${profileId}/opportunities/${leadId}`, { headers });
        return response.data;
    } catch (error) {
        console.error('Lead fetch error:', error);
        throw error;
    }
};

export const addLead = async (profileId: string, contact: LeadInput): Promise<{ message: string }> => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        console.log("Lead:::::::::::::::::::", JSON.stringify(contact, null, 2));
        const response = await ServerApi.post(`/profile/${profileId}/opportunities`, contact, { headers });
        console.log("Lead added response received:", response.status);

        return response.data;
    } catch (error) {
        console.error('Error adding lead:', error);
        throw error;
    }
}

export const updateLead = async (profileId: string, leadId: string, lead: Lead): Promise<{ message: string }> => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        console.log("Lead:::::::::::::::::::", JSON.stringify(lead, null, 2));
        const response = await ServerApi.patch(`/profile/${profileId}/opportunities/${leadId}`, lead, { headers });
        console.log("Lead updated, response received:", response.status);
        return response.data;
    } catch (error: any) {
        console.error("Error updating lead:", {
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

export const deleteLead = async (profileId: string, leadId: string): Promise<{ message: string }> => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        if (!leadId || typeof leadId !== 'string') {
            throw new Error(`Invalid leadId: ${leadId}`);
        }
        const response = await ServerApi.delete(`/profile/${profileId}/opportunities/${leadId}`, { headers });
        console.log("Lead deleted response received:", response.status);

        return response.data;
    } catch (error) {
        console.error('Error deleting lead:', error);
        throw error;
    }
}
export const deleteLeads = async (profileId: string, leads: string[]): Promise<{ message: string }> => {
    const headers = await withServerCookies();
    try {
        if (!profileId || typeof profileId !== 'string') {
            throw new Error(`Invalid profileId: ${profileId}`);
        }
        if (leads.length === 0) {
            throw new Error(`no leads to delete`);
        }
        const response = await ServerApi.post(`/profile/${profileId}/opportunities/delete`, leads, { headers });
        console.log("leads deleted response received:", response.status);

        return response.data;
    } catch (error) {
        console.error('Error deleting leads:', error);
        throw error;
    }
}

