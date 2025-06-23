import { getUserCookieOnServer } from "@/utils/server-cookie"
import { getContacts } from "@/lib/api/contacts"
import type { Contact } from "@/types/contact"
import useTranslate from "@/hooks/use-translate"
import { ContactsDataTable } from "@/components/pages/contacts/data-table/contacts-data-table"

type SearchParams = {
    query?: string
    filter?: string
    sort?: string
    order?: "asc" | "desc"
    rowsPerPage?: string
}

type ContactsPageProps = {
    params: Promise<{ locale: string }>
    searchParams: Promise<SearchParams>
}

export default async function ContactsPage({ params, searchParams }: ContactsPageProps) {
    const { locale } = await params

    // Get user and profile data
    const user = await getUserCookieOnServer()
    const profileId = user?.selectedProfile || null

    // Fetch contacts data
    let contacts: Contact[] = []
    try {
        contacts = await getContacts(profileId)
    } catch (error) {
        console.error("Error fetching contacts:", error)
    }

    return (
        <div>
            <div className="mx-auto px-1 xs:px-2 md:px-4 pt-6 sm:pt-2">
                <ContactsDataTable
                    contacts={contacts}
                    locale={locale}
                    searchParams={await searchParams}
                />
            </div>
        </div>
    )
}
