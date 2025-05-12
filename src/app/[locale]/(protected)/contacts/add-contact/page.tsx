import { Bell, Menu, QrCode, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getUserCookieOnServer } from "@/utils/cookies";
import { getProfile } from "@/lib/api/profile";
import { addContact } from "@/lib/api/contacts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddContactForm from "@/components/pages/contacts/add-contact-form";
import { format, parse } from "date-fns";

// Define ContactInput type to match the Contact model and controller
interface ContactInput {
    name?: string;
    description?: string;
    type: string;
    leadCaptions?: {
        metIn?: string;
        longitude?: number;
        latitude?: number;
        date?: string;
        tags?: string[];
        nextAction?: string;
        dateOfNextAction?: string;
        notes?: string;
    };
    profile: {
        fullName: string;
        firstName?: string;
        lastName?: string;
        companyName?: string;
        position?: string;
        sector?: string;
        bio?: string;
        links?: { name: string; title: string; link: string }[];
        tags?: string[];
        profilePicture?: string;
        logo?: string;
    };
    teams?: string[];
}

export default async function AddContactPage() {
    // Get user and profile data
    const user = await getUserCookieOnServer();
    const profileId = user?.selectedProfile || null;

    // Fetch profile data for the header
    let profileData;
    try {
        profileData = await getProfile(profileId);
    } catch (error) {
        console.error("Error fetching profile:", error);
    }

    // Get user name and profile picture
    const fullName = profileData
        ? `${profileData.firstName} ${profileData.lastName}`
        : "User";
    const profilePictureUrl = profileData?.profilePicture
        ? `/api/files/${profileData.profilePicture}`
        : "/img/user.png";
    const themeColor = profileData?.theme?.color || "#3b82f6"; // Default to blue

    // Handle form submission
    async function createContact(formData: FormData) {
        "use server";

        if (!profileId) {
            return { success: false, message: "Profile ID is missing" };
        }

        try {
            // Extract form data
            const fullName = formData.get("fullName") as string;
            const firstName = formData.get("firstName") as string;
            const lastName = formData.get("lastName") as string;
            const phoneNumber = formData.get("phoneNumber") as string;
            const email = formData.get("email") as string;
            const position = formData.get("position") as string;
            const companyName = formData.get("companyName") as string;
            const nextAction = formData.get("nextAction") as string;
            const nextActionDateStr = formData.get("nextActionDate") as string;
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

            // Add phoneNumber and email to links
            if (phoneNumber) {
                links.push({ name: "phone number", title: "phone number", link: phoneNumber });
            }
            if (email) {
                links.push({ name: "email", title: "email", link: email });
            }

            // Parse date if exists
            let dateOfNextAction: string | undefined = undefined;
            if (nextActionDateStr) {
                try {
                    const parsedDate = parse(nextActionDateStr, "yyyy-MM-dd", new Date());
                    dateOfNextAction = format(parsedDate, "yyyy-MM-dd");
                } catch (error) {
                    console.error("Invalid date format for nextActionDateStr:", nextActionDateStr);
                    dateOfNextAction = undefined;
                }
            }

            // Create contact object
            const contactData: ContactInput = {
                name: fullName, // Use fullName as the contact name
                description: notes, // Use notes as description
                type: "manual",
                profile: {
                    fullName,
                    firstName: firstName || undefined,
                    lastName: lastName || undefined,
                    companyName: companyName || undefined,
                    position: position || undefined,
                    links: links.length > 0 ? links : undefined,
                    tags: tags.length > 0 ? tags : undefined,
                },
                leadCaptions: {
                    metIn: metIn || undefined,
                    tags: tags.length > 0 ? tags : undefined,
                    nextAction: nextAction || undefined,
                    dateOfNextAction: dateOfNextAction || undefined,
                    notes: notes || undefined,
                },
            };

            // Call the external API
            const result = await addContact(profileId, contactData);

            // Return success
            return { success: true, message: "Contact added successfully" };
        } catch (error: any) {
            console.error("Error creating contact:", {
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
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to add contact. Please try again.",
            };
        }
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <header className="flex items-center justify-between p-4">
                <Link href="/contacts">
                    <Button variant="ghost" size="icon">
                        <Menu size={24} />
                    </Button>
                </Link>
                <h1 className="text-xl font-medium">Add Contact</h1>
                <div className="flex items-center gap-4">
                    <button>
                        <Bell size={24} />
                    </button>
                    <div className="relative">
                        <Image
                            src={profilePictureUrl}
                            alt={fullName}
                            width={40}
                            height={40}
                            className="rounded-md"
                        />
                        <div
                            className="absolute -bottom-1 -right-1 text-xs px-1 rounded text-white"
                            style={{ backgroundColor: themeColor }}
                        >
                            90%
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="px-4 py-2 max-w-4xl mx-auto">
                <Tabs defaultValue="manual" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="manual">Manual</TabsTrigger>
                        <TabsTrigger value="scan">
                            <QrCode size={16} className="mr-2" />
                            Scan
                        </TabsTrigger>
                        <TabsTrigger value="import">
                            <Upload size={16} className="mr-2" />
                            Import
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual">
                        <AddContactForm createContact={createContact} themeColor={themeColor} />
                    </TabsContent>

                    <TabsContent value="scan">
                        <div className="text-center py-12">
                            <QrCode size={80} className="mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium mb-2">Scan QR Code</h3>
                            <p className="text-muted-foreground">
                                This feature will be available soon. Scan business cards or QR codes to add contacts.
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="import">
                        <div className="text-center py-12">
                            <Upload size={80} className="mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium mb-2">Import Contacts</h3>
                            <p className="text-muted-foreground">
                                This feature will be available soon. Import contacts from Google or your phone.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}