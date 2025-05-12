import { Bell, Menu, QrCode, Upload } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getUserCookieOnServer } from "@/utils/cookies"
import { getProfile } from "@/lib/api/profile"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddContactForm from "@/components/pages/contacts/add-contact-form"
import { createContactAction, addLinkAction } from "./actions"

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

    // Create a bound version of the createContactAction with the profileId
    const createContact = async (formData: any) => {
        "use server"
        if (!profileId) {
            return { success: false, message: "Profile ID is missing" }
        }
        return createContactAction(profileId, formData)
    }

    // Create a bound version of the addLinkAction with the profileId
    const addLink = async (existingLinks: any[], newLink: any) => {
        "use server"
        if (!profileId) {
            return { success: false, message: "Profile ID is missing" }
        }
        return addLinkAction(profileId, existingLinks, newLink)
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
                        <AddContactForm createContact={createContact} addLink={addLink} themeColor={themeColor} />
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
    )
}
