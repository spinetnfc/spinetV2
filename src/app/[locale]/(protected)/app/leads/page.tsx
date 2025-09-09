import { LeadsDataTable } from "@/components/pages/leads/data-table/leads-data-table"
import { getLocale } from "@/utils/getServerLocale";

type SearchParams = {
    types?: string[];
    status?: Array<
        | "pending"
        | "prospecting"
        | "offer-sent"
        | "negotiation"
        | "administrative-validation"
        | "done"
        | "failed"
        | "canceled">;
    priority?: Array<"none" | "low" | "medium" | "high" | "critical">;
    lifeTime?: {
        begins: {
            start: string;
            end: string;
        };
        ends: {
            start: string;
            end: string;
        };
    };
    tags?: string[];
    contacts?: string[];
    search?: string
    filter?: string
    sort?: string
    page?: string
    rowsPerPage?: string
}

type ContactsPageProps = {
     searchParams: Promise<SearchParams>
}

export default async function Leads(props: ContactsPageProps) {
    const searchParams = await props.searchParams;
    const  locale  = await getLocale()||"en";
    const sp = await searchParams

    return (
        <div>
                 <LeadsDataTable
                    locale={locale}
                    searchParams={sp}
                />
         </div>
    )
}
