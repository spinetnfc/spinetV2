import { Bell, Menu } from 'lucide-react'
import Image from "next/image"
import { getUserCookieOnServer } from "@/utils/cookies"
import { getProfile } from "@/lib/api/profile"
import SearchInput from "@/components/pages/contacts/search-input"
import FilterTabs from "@/components/pages/contacts/filter-tabs"
import ContactItem from "@/components/pages/contacts/contact-item"
import AddContactButton from "@/components/pages/contacts/add-contact-button"
import { getContacts } from "@/lib/api/contacts"
import type { Contact } from "@/types/contact"
import { Spinner } from "@/components/ui/spinner"

export default async function ContactsPage({
    searchParams,
}: {
    searchParams: Promise<{ query: string; filter: string }>
}) {
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

    // Fetch contacts data
    let contacts: Contact[] = []
    try {
        contacts = await getContacts(profileId)
        console.log("contactsData", contacts)
    } catch (error) {
        console.error("Error fetching contacts:", error)
        // Continue with empty contacts array instead of throwing
    }

    // Filter contacts based on search query
    const { query = "", filter = "all" } = await searchParams

    let filteredContacts = contacts

    if (query) {
        filteredContacts = filteredContacts.filter(
            (contact) =>
                contact.name.toLowerCase().includes(query.toLowerCase()) ||
                (contact.profile.compantName && contact.profile.compantName.toLowerCase().includes(query.toLowerCase())) ||
                (contact.profile.position && contact.profile.position.toLowerCase().includes(query.toLowerCase())),
        )
    }

    if (filter !== "all") {
        filteredContacts = filteredContacts.filter((contact) => contact.profile.type === filter)
    }

    // Get user name and profile picture
    const fullName = profileData ? `${profileData.firstName} ${profileData.lastName}` : "User"
    const profilePictureUrl = profileData?.profilePicture ? `/api/files/${profileData.profilePicture}` : "/img/user.png"
    const themeColor = profileData?.theme?.color || "#3b82f6" // Default to blue if undefined

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <header className="flex items-center justify-between p-4">
                <button>
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-medium">{fullName}</h1>
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

            {/* Search */}
            <div className="px-4 py-2">
                <SearchInput />
            </div>

            {/* Filter */}
            <div className="px-4 mt-2">
                <h2 className="text-xl mb-2">Filter</h2>
                <FilterTabs themeColor={themeColor} />
            </div>

            {/* Add contact button */}
            <div className="flex justify-end px-4 mt-4">
                <AddContactButton themeColor={themeColor} />
            </div>

            {/* Contact list */}
            <div className="px-4 mt-2">
                {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact: Contact) => <ContactItem key={contact.name} contact={contact} themeColor={themeColor} />)
                ) : (
                    <p className="text-center py-8 text-gray-500">No contacts found</p>
                )}
            </div>
        </div>
    )
}
