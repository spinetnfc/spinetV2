import { deleteContact, deleteContacts, updateContact } from "@/lib/api/contacts";
import { ContactInput } from "@/types/contact";

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