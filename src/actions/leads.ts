"use server";
import { addLead, deleteLead, deleteLeads, updateLead } from "@/lib/api/leads";
import { filterLeads as apiFilterLeads } from "@/lib/api/leads";
import { LeadFilters, Lead, LeadInput } from "@/types/leads";
import { format, parse } from "date-fns";


export const filterLeads = async (profileId: string | null, filters: LeadFilters): Promise<Lead[]> => {
    if (!profileId) {
        console.error("Profile ID is missing");
        return [];
    }
    try {
        console.log("fetching leads with filters")
        const response = await apiFilterLeads(profileId, filters);
        // If response is an array, return it. If it's an object with data, return data.
        const leads = Array.isArray(response) ? response : response?.data;
        console.log("leads to return:::::", leads)
        return leads || [];
    } catch (error) {
        console.error("Error filtering leads:", error);
        return [];
    }
}
export const editContact = async (profileId: string, leadId: string, updatedLead: Lead) => {

    if (!profileId) {
        return { success: false, message: "Profile ID is missing" };
    }
    try {
        console.log("Updating lead:", leadId)
        const response = await updateLead(profileId, leadId, updatedLead)
        return { success: true, message: response.message }
    } catch (error) {
        console.error("Error updating lead:", error)
        return { success: false, message: "Error updating lead" }
    }
}

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
// export const createLead = async (profileId: string, formData: FormData) => {
//     ;

//     if (!profileId) {
//         return { success: false, message: "Profile ID is missing" };
//     }

//     try {
//         // Extract form data
//         const fullName = formData.get("fullName") as string;
//         const phoneNumber = formData.get("phoneNumber") as string;
//         const email = formData.get("email") as string;
//         const position = formData.get("position") as string;
//         const companyName = formData.get("companyName") as string;
//         const nextAction = formData.get("nextAction") as string;
//         const nextActionDateStr = formData.get("dateOfNextAction") as string;
//         const metIn = formData.get("metIn") as string;
//         const notes = formData.get("notes") as string;
//         const tagsJson = formData.get("tags") as string;
//         const linksJson = formData.get("links") as string;

//         // Validate required fields
//         if (!fullName) {
//             return { success: false, message: "Full name is required" };
//         }

//         // Parse JSON strings
//         const tags = tagsJson ? JSON.parse(tagsJson) : [];
//         let links = linksJson ? JSON.parse(linksJson) : [];

//         // Validate links
//         for (const link of links) {
//             if (!link.title || !link.link) {
//                 return { success: false, message: `Incomplete link: ${link.title || "Unknown"}` };
//             }
//         }

//         // Parse date if exists
//         let dateOfNextAction: string | undefined = undefined;
//         if (nextActionDateStr) {
//             try {
//                 const parsedDate = parse(nextActionDateStr, "yyyy-MM-dd", new Date());
//                 dateOfNextAction = format(parsedDate, "yyyy-MM-dd");
//             } catch (error) {
//                 console.error("Invalid date format for dateOfNextAction:", nextActionDateStr);
//             }
//         }

//         // Create contact object
//         const leadData: LeadInput = {
//             name: fullName, // Derive from fullName
//             description: notes || undefined,
//             type: type || "manual", // Default to "manual" if not provided
//             profile: {
//                 fullName,
//                 companyName: companyName || undefined,
//                 position: position || undefined,
//                 links: links.length > 0 ? links : undefined,
//             },
//             leadCaptions: {
//                 metIn: metIn || undefined,
//                 tags: tags.length > 0 ? tags : undefined,
//                 nextAction: nextAction || undefined,
//                 dateOfNextAction: dateOfNextAction || undefined,
//                 notes: notes || undefined,
//             },
//         };

//         // Log contact data for debugging
//         console.log("Contact data sent:", JSON.stringify(leadData, null, 2));

//         // Call the external API
//         const result = await addLead(profileId, leadData);

//         return { success: true, message: "Contact added successfully" };
//     } catch (error: any) {
//         console.error("Error creating lead:", {
//             message: error.message,
//             response: error.response
//                 ? {
//                     status: error.response.status,
//                     statusText: error.response.statusText,
//                     data: JSON.stringify(error.response.data, null, 2),
//                 }
//                 : "No response data available",
//             stack: error.stack,
//             formData: Object.fromEntries(formData.entries()),
//         });
//         return {
//             success: false,
//             message: error.response?.data?.message || error.message || "Failed to add contact. Please try again.",
//         };
//     }
// }
