import { LeadsDataTable } from "@/components/pages/leads/data-table/leads-data-table"

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
    params: Promise<{ locale: string }>
    searchParams: Promise<SearchParams>
}

export default async function Leads({ params, searchParams }: ContactsPageProps) {
    const { locale } = await params
    const sp = await searchParams

    return (
        <div>
            <div className="mx-auto px-1 xs:px-2 md:px-4 pt-6 sm:pt-4">
                <LeadsDataTable
                    locale={locale}
                    searchParams={sp}
                />
            </div>
        </div>
    )
}
