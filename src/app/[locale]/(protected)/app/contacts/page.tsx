import { getUserCookieOnServer } from "@/utils/server-cookie"
import { getProfile } from "@/lib/api/profile"
import { getContacts } from "@/lib/api/contacts"
import type { Contact } from "@/types/contact"
import useTranslate from "@/hooks/use-translate"
import { ContactsDataTable } from "@/components/pages/contacts/contacts-data-table"

type SearchParams = {
    query?: string
    filter?: string
    sort?: string
    order?: "asc" | "desc"
}

type ContactsPageProps = {
    params: Promise<{ locale: string }>
    searchParams: Promise<SearchParams>
}

export default async function ContactsPage({ params, searchParams }: ContactsPageProps) {
    const { locale } = await params
    const { t } = await useTranslate(locale)

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
    } catch (error) {
        console.error("Error fetching contacts:", error)
        // Continue with empty contacts array
    }

    // Get theme color
    const themeColor = profileData?.theme?.color || "#3b82f6" // Default to blue

    return (
        <div className="min-h-screen py-16">
            <div className="container mx-auto px-2 xs:px-4">
                <ContactsDataTable
                    contacts={contacts}
                    themeColor={themeColor}
                    locale={locale}
                    searchParams={await searchParams}
                />
            </div>
        </div>
    )
}
