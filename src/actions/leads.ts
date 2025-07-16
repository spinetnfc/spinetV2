"use server";
import { addLead, addNote, deleteLead, deleteLeads, updateLead } from "@/lib/api/leads";
import { filterLeads as apiFilterLeads } from "@/lib/api/leads";
import { LeadFilters, Lead, LeadInput, Note } from "@/types/leads";


export const filterLeads = async (profileId: string | null, filters: LeadFilters): Promise<Lead[]> => {
    if (!profileId) {
        console.error("Profile ID is missing");
        return [];
    }
    try {
        console.log("fetching leads with filters:::", filters)
        const response = await apiFilterLeads(profileId, filters);
        // If response is an array, return it. If it's an object with data, return data.
        const leads = Array.isArray(response) ? response : response?.data;
        // console.log("leads to return:::::", leads)
        return leads || [];
    } catch (error: any) {
        console.error("Error filtering leads:", {
            message: error.message,
            response: error.response
                ? {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: JSON.stringify(error.response.data, null, 2),
                }
                : "No response data available",
        });
        return [];
    }
}

export const editLead = async (profileId: string, leadId: string, formData: FormData) => {
    if (!profileId) {
        return { success: false, message: "Profile ID is missing" };
    }

    try {
        // Extract form data for LeadInput
        const name = formData.get("name") as string;
        const description = formData.get("description") as string | null;
        const contactsJson = formData.get("Contacts") as string | null;
        const mainContact = formData.get("mainContact") as string | null;
        const amountStr = formData.get("amount") as string | null;
        const status = formData.get("status") as string | null;
        const priority = formData.get("priority") as string | null;
        const lifeTimeBegins = formData.get("lifeTimeBegins") as string | null;
        const lifeTimeEnds = formData.get("lifeTimeEnds") as string | null;
        const tagsJson = formData.get("tags") as string | null;
        const notesJson = formData.get("notes") as string | null;

        if (!name) {
            return { success: false, message: "Name is required" };
        }

        // Parse JSON fields
        const Contacts = contactsJson ? JSON.parse(contactsJson) : undefined;
        const tags = tagsJson ? JSON.parse(tagsJson) : undefined;
        const notes = notesJson ? JSON.parse(notesJson) : undefined;
        const amount = amountStr ? parseFloat(amountStr) : undefined;

        // Convert dates to ISO 8601 format
        let lifeTime = undefined;
        if (lifeTimeBegins || lifeTimeEnds) {
            lifeTime = {
                begins: lifeTimeBegins ? new Date(lifeTimeBegins).toISOString() : undefined,
                ends: lifeTimeEnds ? new Date(lifeTimeEnds).toISOString() : undefined,
            };
        }

        const leadData: LeadInput = {
            name,
            description: description || undefined,
            Contacts,
            mainContact: mainContact || undefined,
            amount,
            status: status as LeadInput["status"] || undefined,
            priority: priority as LeadInput["priority"] || undefined,
            lifeTime,
            Tags: tags,
            notes,
        };

        const response = await updateLead(profileId, leadId, leadData);

        return { success: true, message: response.message };
    } catch (error: any) {
        console.error("Error updating lead:", {
            message: error.message,
            response: error.response
                ? {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: JSON.stringify(error.response.data, null, 2),
                }
                : "No response data available",
            formData: Object.fromEntries(formData.entries()),
        });
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to update lead. Please try again.",
        };
    }
};
export const removeLead = async (profileId: string, leadId: string) => {

    if (!profileId) {
        return { success: false, message: "Profile ID is missing" };
    }
    try {
        console.log("Removing lead:", leadId)
        const response = await deleteLead(profileId, leadId)
        return { success: true, message: response.message }
    } catch (error) {
        console.error("Error removing lead:", error)
        return { success: false, message: "Error removing lead" }
    }
}

export const removeLeads = async (profileId: string, leads: string[]) => {

    if (!profileId) {
        return { success: false, message: "Profile ID is missing" };
    }
    try {
        console.log("Removing multiple leads")
        const response = await deleteLeads(profileId, leads)
        return { success: true, message: response.message }
    } catch (error) {
        console.error("Error removing leads:", error)
        return { success: false, message: "Error removing leads" }
    }
}
export const createLead = async (profileId: string, formData: FormData) => {
    if (!profileId) {
        return { success: false, message: "Profile ID is missing" };
    }

    try {
        // Extract form data for LeadInput
        const name = formData.get("name") as string;
        const description = formData.get("description") as string | null;
        const contactsJson = formData.get("Contacts") as string | null;
        const mainContact = formData.get("mainContact") as string | null;
        const amountStr = formData.get("amount") as string | null;
        const status = formData.get("status") as string | null;
        const priority = formData.get("priority") as string | null;
        const lifeTimeJson = formData.get("lifeTime") as string | null;
        const tagsJson = formData.get("Tags") as string | null;

        if (!name) {
            return { success: false, message: "Name is required" };
        }

        // Parse JSON fields
        const Contacts = contactsJson ? JSON.parse(contactsJson) : undefined;
        const lifeTime = lifeTimeJson ? JSON.parse(lifeTimeJson) : undefined;
        const Tags = tagsJson ? JSON.parse(tagsJson) : undefined;
        const amount = amountStr ? parseFloat(amountStr) : undefined;

        const leadData: LeadInput = {
            name,
            description: description || undefined,
            Contacts,
            mainContact: mainContact || undefined,
            amount,
            status: status as LeadInput["status"] || undefined,
            priority: priority as LeadInput["priority"] || undefined,
            lifeTime,
            Tags,
        };

        // Log lead data for debugging
        console.log("Lead data sent:", JSON.stringify(leadData, null, 2));

        // Call the external API
        const result = await addLead(profileId, leadData);

        return { success: true, message: "Lead added successfully" };
    } catch (error: any) {
        console.error("Error creating lead:", {
            message: error.message,
            response: error.response
                ? {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: JSON.stringify(error.response.data, null, 2),
                }
                : "No response data available",
            formData: Object.fromEntries(formData.entries()),
        });
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to add lead. Please try again.",
        };
    }
}

export const addNoteAction = async (profileId: string, leadId: string, note: string): Promise<{ success: boolean; message: Note | string }> => {
    if (!profileId) {
        return { success: false, message: "Profile ID is missing" };
    }

    try {
        const response = await addNote(profileId, leadId, note);
        return { success: true, message: response.message };
    } catch (error) {
        console.error("Error adding note:", error);
        return { success: false, message: "Error adding note" };
    }
}