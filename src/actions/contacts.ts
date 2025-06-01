"use server";
import { addContact, deleteContact, deleteContacts, updateContact } from "@/lib/api/contacts";
import { ContactInput } from "@/types/contact";
import { format, parse } from "date-fns";


export const editContact = async (profileId: string, contactId: string, updatedContact: ContactInput) => {
    "use server"
    if (!profileId) {
        return { success: false, message: "Profile ID is missing" };
    }
    try {
        console.log("Updating contact:", contactId)
        const response = await updateContact(profileId, contactId, updatedContact)
        return { success: true, message: response.message }
    } catch (error) {
        console.error("Error updating contact:", error)
        return { success: false, message: "Error updating contact" }
    }
}

export const removeContact = async (profileId: string, contactId: string) => {
    "use server"
    if (!profileId) {
        return { success: false, message: "Profile ID is missing" };
    }
    try {
        console.log("Removing contact:", contactId)
        const response = await deleteContact(profileId, contactId)
        return { success: true, message: response.message }
    } catch (error) {
        console.error("Error removing contact:", error)
        return { success: false, message: "Error removing contact" }
    }
}

export const removeContacts = async (profileId: string, contacts: string[]) => {
    "use server"
    if (!profileId) {
        return { success: false, message: "Profile ID is missing" };
    }
    try {
        console.log("Removing multiple contacts")
        const response = await deleteContacts(profileId, contacts)
        return { success: true, message: response.message }
    } catch (error) {
        console.error("Error removing contact:", error)
        return { success: false, message: "Error removing contact" }
    }
}
export const createContact = async (profileId: string, formData: FormData, type: "manual" | "scan" | "exchange" | "spinet" | "phone" | undefined) => {
    "use server";

    if (!profileId) {
        return { success: false, message: "Profile ID is missing" };
    }

    try {
        // Extract form data
        const fullName = formData.get("fullName") as string;
        const phoneNumber = formData.get("phoneNumber") as string;
        const email = formData.get("email") as string;
        const position = formData.get("position") as string;
        const companyName = formData.get("companyName") as string;
        const nextAction = formData.get("nextAction") as string;
        const nextActionDateStr = formData.get("dateOfNextAction") as string;
        const metIn = formData.get("metIn") as string;
        const notes = formData.get("notes") as string;
        const tagsJson = formData.get("tags") as string;
        const linksJson = formData.get("links") as string;

        // Validate required fields
        if (!fullName) {
            return { success: false, message: "Full name is required" };
        }

        // Parse JSON strings
        const tags = tagsJson ? JSON.parse(tagsJson) : [];
        let links = linksJson ? JSON.parse(linksJson) : [];

        // Validate links
        for (const link of links) {
            if (!link.title || !link.link) {
                return { success: false, message: `Incomplete link: ${link.title || "Unknown"}` };
            }
        }

        // Parse date if exists
        let dateOfNextAction: string | undefined = undefined;
        if (nextActionDateStr) {
            try {
                const parsedDate = parse(nextActionDateStr, "yyyy-MM-dd", new Date());
                dateOfNextAction = format(parsedDate, "yyyy-MM-dd");
            } catch (error) {
                console.error("Invalid date format for dateOfNextAction:", nextActionDateStr);
            }
        }

        // Create contact object
        const contactData: ContactInput = {
            name: fullName, // Derive from fullName
            description: notes || undefined,
            type: type || "manual", // Default to "manual" if not provided
            profile: {
                fullName,
                companyName: companyName || undefined,
                position: position || undefined,
                links: links.length > 0 ? links : undefined,
            },
            leadCaptions: {
                metIn: metIn || undefined,
                tags: tags.length > 0 ? tags : undefined,
                nextAction: nextAction || undefined,
                dateOfNextAction: dateOfNextAction || undefined,
                notes: notes || undefined,
            },
        };

        // Log contact data for debugging
        console.log("Contact data sent:", JSON.stringify(contactData, null, 2));

        // Call the external API
        const result = await addContact(profileId, contactData);

        return { success: true, message: "Contact added successfully" };
    } catch (error: any) {
        console.error("Error creating contact:", {
            message: error.message,
            response: error.response
                ? {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: JSON.stringify(error.response.data, null, 2),
                }
                : "No response data available",
            stack: error.stack,
            formData: Object.fromEntries(formData.entries()),
        });
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to add contact. Please try again.",
        };
    }
}