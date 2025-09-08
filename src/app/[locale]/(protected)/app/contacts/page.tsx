 
import { ContactsDataTable } from "@/components/pages/contacts/data-table/contacts-page"
  import { getUserCookieOnServer } from "@/utils/server-cookie"
 
 
  // Define the props type for ContactsPage
  type ContactsPageProps = {
     searchParams: Record<string, string>
  }
  
       // Fetch contacts data
      export default async function ContactsPage(props: ContactsPageProps) {
      const searchParams = await props.searchParams;
       const user = await getUserCookieOnServer()


    return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      
 
      <div className="flex">
      

        {/* Main Content */}
        <main className="flex-1 p-6">
          
             <div className="flex-1">
              <ContactsDataTable  locale="en" searchParams={searchParams} />
            </div>

               
           
        </main>
      </div>
    </div>
  )
}
