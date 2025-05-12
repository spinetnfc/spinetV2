import { Bell, Menu, QrCode, Upload } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getUserCookieOnServer } from "@/utils/cookies"
import { getProfile } from "@/lib/api/profile"
import { addContact } from "@/lib/api/contacts"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddContactForm from "@/components/pages/contacts/add-contact-form"
import { redirect } from "next/navigation"
import type { ContactInput } from "@/types/contact"

export default async function AddContactPage() {
    // Get user and profile data
    const user = await getUserCookieOnServer()
    const profileId = user?.selectedProfile || null

    // Fetch profile data for the header
    let profileData
    try {
        profileData = await getProfile(profileId)
    } catch (error) {
        console.error("Error fetching profile:", error)
    }

    // Get user name and profile picture
    const fullName = profileData ? `${profileData.firstName} ${profileData.lastName}` : "User"
    const profilePictureUrl = profileData?.profilePicture ? `/api/files/${profileData.profilePicture}` : "/img/user.png"
    const themeColor = profileData?.theme?.color || "#3b82f6" // Default to blue if undefined

    // Handle form submission
    async function createContact(formData: FormData) {
        "use server"

        if (!profileId) {
            return { success: false, message: "Profile ID is missing" }
        }

        try {
            // Extract form data
            const fullName = formData.get("fullName") as string
            const phoneNumber = formData.get("phoneNumber") as string
            const email = formData.get("email") as string
            const position = formData.get("position") as string
            const companyName = formData.get("companyName") as string
            const nextAction = formData.get("nextAction") as string
            const nextActionDateStr = formData.get("nextActionDate") as string
            const metIn = formData.get("metIn") as string
            const notes = formData.get("notes") as string
            const tagsJson = formData.get("tags") as string
            const linksJson = formData.get("links") as string

            // Parse JSON strings
            const tags = tagsJson ? JSON.parse(tagsJson) : []
            const links = linksJson ? JSON.parse(linksJson) : []

            // Parse date if exists
            const nextActionDate = nextActionDateStr ? new Date(nextActionDateStr) : undefined

            // Create contact object
            const contactData: ContactInput = {
                name: fullName,
                phoneNumber,
                email,
                profile: {
                    position,
                    compantName: companyName,
                    type: "personal", // Default type
                },
                nextAction,
                nextActionDate,
                metIn,
                notes,
                tags,
                links,
            }

            // Call the external API
            const result = await addContact(profileId, contactData)

            // Redirect to contacts page after successful submission
            redirect("/contacts")
        } catch (error) {
            console.error("Error creating contact:", error)
            return { success: false, message: "Failed to add contact. Please try again." }
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
                            src={profilePictureUrl || "/placeholder.svg"}
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
                        <Card className="p-4">
                            <AddContactForm createContact={createContact} themeColor={themeColor} />
                        </Card>
                    </TabsContent>

                    <TabsContent value="scan">
                        <Card className="p-6">
                            <div className="text-center py-12">
                                <QrCode size={80} className="mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-medium mb-2">Scan QR Code</h3>
                                <p className="text-muted-foreground">
                                    This feature will be available soon. Scan business cards or QR codes to add contacts.
                                </p>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="import">
                        <Card className="p-6">
                            <div className="text-center py-12">
                                <Upload size={80} className="mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-medium mb-2">Import Contacts</h3>
                                <p className="text-muted-foreground">
                                    This feature will be available soon. Import contacts from Google or your phone.
                                </p>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
