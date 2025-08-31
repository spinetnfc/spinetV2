 import { Search, Plus, Filter, MoreHorizontal, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ContactsDataTable } from "@/components/pages/contacts/data-table/contacts-page"
import { Contact } from "@/types/contact"
import { getContacts } from "@/lib/api/contacts"
import { getUserCookieOnServer } from "@/utils/server-cookie"
import { Badge } from "@/components/ui/badge"
import { FilterDialogue } from "@/components/pages/contacts/data-table/filter-dialogue"
import { ContactSourceFilter } from "@/components/pages/contacts/data-table/contact-source-filter"
 
 
  // Define the props type for ContactsPage
  type ContactsPageProps = {
    params: { locale: string }
    searchParams: Record<string, string>
  }
  
       // Fetch contacts data
      export default async function ContactsPage(props: ContactsPageProps) {
      const searchParams = await props.searchParams;
      const { locale } = await props.params
      const user = await getUserCookieOnServer()
      const profileId = user?.selectedProfile || undefined


    return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      
 
      <div className="flex">
      

        {/* Main Content */}
        <main className="flex-1 p-6">
          
             <div className="flex-1">
              <ContactsDataTable profileId={profileId} locale="en" searchParams={{}} />
            </div>

               
           
        </main>
      </div>
    </div>
  )
}
