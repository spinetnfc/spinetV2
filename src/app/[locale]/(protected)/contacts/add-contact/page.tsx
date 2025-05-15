import { Edit, QrCode, Upload } from "lucide-react";
import { getUserCookieOnServer } from "@/utils/server-cookie";
import { getProfile } from "@/lib/api/profile";
import { addContact } from "@/lib/api/contacts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AddContactForm from "@/components/pages/contacts/add-contact-form";
import ImportContacts from "@/components/pages/contacts/import-contacts";
import { format, parse } from "date-fns";
import type { ContactInput } from "@/types/contact";
import useTranslate from "@/hooks/use-translate";

export default async function AddContactPage({ params }: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const { t } = await useTranslate(locale);
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
                type: "manual",
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

    return (
        <div className="min-h-screen py-16">
            <div className="px-4 py-2 max-w-4xl mx-auto">
                <Tabs defaultValue="manual" className="w-full" dir={locale === "ar" ? "rtl" : "ltr"}>
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="manual" className="text-xs sm:text-sm">
                            <Edit size={16} className="me-0.5 sm:me-2" />
                            {t("manual")}
                        </TabsTrigger>
                        <TabsTrigger value="scan" className="text-xs sm:text-sm">
                            <QrCode size={16} className="me-0.5 sm:me-2" />
                            {t("scan")}
                        </TabsTrigger>
                        <TabsTrigger value="import" className="text-xs sm:text-sm">
                            <Upload size={16} className="me-0.5 sm:me-2" />
                            {t("import")}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual">
                        <AddContactForm createContact={createContact} themeColor={themeColor} locale={locale} />
                    </TabsContent>

                    <TabsContent value="scan">
                        <div className="text-center py-12">
                            <QrCode size={80} className="mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium mb-2">{t("scan-qr-code")}</h3>
                            <p className="text-muted-foreground">
                                This feature will be available soon. Scan business cards or QR codes to add contacts.
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="import">
                        <ImportContacts createContact={createContact} themeColor={themeColor} locale={locale} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}