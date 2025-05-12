"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
// Import your actual API functions
// import { createContact } from "@/lib/api/contacts"
// import { updateProfile } from "@/lib/api/profile"

// Define the contact schema with Zod
const contactSchema = z.object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
    phoneNumber: z.string().min(5, { message: "Phone number is required" }),
    email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
    position: z.string().optional(),
    companyName: z.string().optional(),
    nextAction: z.string().optional(),
    nextActionDate: z.date().optional().nullable(),
    metIn: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).default([]),
    links: z
        .array(
            z.object({
                name: z.string(),
                title: z.string(),
                link: z.string(),
            }),
        )
        .default([]),
})

export type ContactFormValues = z.infer<typeof contactSchema>

export async function createContactAction(profileId: string, formData: ContactFormValues) {
    // Validate the form data
    const validatedFields = contactSchema.safeParse(formData)

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Invalid form data. Please check your inputs.",
        }
    }

    try {
        // Here you would call your actual API to create the contact
        // await createContact(profileId, validatedFields.data)

        // For now, we'll just log the data
        console.log("Creating contact:", validatedFields.data)

        // Revalidate the contacts page to show the new contact
        revalidatePath("/contacts")

        // Return success
        return {
            success: true,
            message: "Contact added successfully",
        }
    } catch (error) {
        console.error("Error creating contact:", error)
        return {
            success: false,
            message: "Failed to add contact. Please try again.",
        }
    }
}

export async function addLinkAction(
    profileId: string,
    existingLinks: any[],
    newLink: { name: string; title: string; link: string },
) {
    try {
        // Validate the new link
        if (!newLink.name || !newLink.title) {
            return {
                success: false,
                message: "Please fill in all required fields",
            }
        }

        // Add the new link to existing links
        const updatedLinks = [...existingLinks, newLink]

        // Call your actual API to update the profile
        // await updateProfile(profileId, { links: updatedLinks })

        // For now, we'll just log the data
        console.log("Adding link to profile:", { profileId, updatedLinks })

        return {
            success: true,
            message: "Link added successfully",
            links: updatedLinks,
        }
    } catch (error) {
        console.error("Error adding link:", error)
        return {
            success: false,
            message: "Failed to add link. Please try again.",
        }
    }
}
