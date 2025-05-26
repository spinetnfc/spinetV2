import { getUserCookieOnServer } from "@/utils/server-cookie";
import { getProfile } from "@/lib/api/profile";
import SearchInput from "@/components/pages/contacts/search-input";
import FilterTabs from "@/components/pages/contacts/filter-tabs";
import { deleteContact, deleteContacts, getContacts, updateContact } from "@/lib/api/contacts";
import type { Contact, ContactInput } from "@/types/contact";
import useTranslate from "@/hooks/use-translate";
import ContactList from "@/components/pages/contacts/contact-list";

type SearchParams = {
    query?: string
    filter?: string
}

type ContactsPageProps = {
    params: Promise<{ locale: string }>
    searchParams: Promise<SearchParams>
}

export default async function ContactsPage({ params, searchParams }: ContactsPageProps) {
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

    // Fetch contacts data
    let contacts: Contact[] = [];
    try {
        contacts = await getContacts(profileId);
        // console.log("contactsData", JSON.stringify(contacts, null, 2));
    } catch (error) {
        console.error("Error fetching contacts:", error);
        // Continue with empty contacts array
    }

    // Filter contacts based on search query
    const { query = "", filter = "all" } = await searchParams;

    let filteredContacts = contacts;

    if (query) {
        filteredContacts = filteredContacts.filter((contact) => {
            // Handle id-only profile
            if ("id" in contact.Profile) {
                return contact.name.toLowerCase().includes(query.toLowerCase());
            }
            // Detailed profile
            return (
                contact.name.toLowerCase().includes(query.toLowerCase()) ||
                (contact.Profile.companyName &&
                    contact.Profile.companyName.toLowerCase().includes(query.toLowerCase())) ||
                (contact.Profile.position &&
                    contact.Profile.position.toLowerCase().includes(query.toLowerCase()))
            );
        });
    }

    if (filter !== "all") {
        filteredContacts = filteredContacts.filter((contact) => {
            // Handle id-only profile
            if ("id" in contact.Profile) {
                return false; // Skip id-only profiles for type filtering
            }
            return contact.type === filter;
        });
    }

    // Get user name and profile picture
    const fullName = profileData
        ? `${profileData.firstName} ${profileData.lastName}`
        : "User";
    const profilePictureUrl = profileData?.profilePicture
        ? `/api/files/${profileData.profilePicture}`
        : "/img/user.png";
    const themeColor = profileData?.theme?.color || "#3b82f6"; // Default to blue

    const editContact = async (contactId: string, updatedContact: ContactInput) => {
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

    const removeContact = async (contactId: string) => {
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

    const removeContacts = async (contacts: string[]) => {
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

    return (
        <div className="min-h-screen py-16">

            {/* Search */}
            <div className="px-2 xs:px-4 py-2">
                <SearchInput />
            </div>

            {/* Filter */}
            <div className="px-2 xs:px-4 mt-2">
                <h2 className="text-xl mb-2">{t("filter")}</h2>
                <FilterTabs themeColor={themeColor} />
            </div>

            {/* Contact list */}
            <ContactList
                filteredContacts={filteredContacts}
                themeColor={themeColor}
                removeContact={removeContact}
                editContact={editContact}
                removeContacts={removeContacts}
                locale={locale}
            />
        </div>
    );
}