export type LeadInput = {
    name: string;
    description?: string;
    Contacts?: string[];
    mainContact?: string | null;
    amount?: number;
    status?:
    | "pending"
    | "prospecting"
    | "offer-sent"
    | "negotiation"
    | "administrative-validation"
    | "done"
    | "failed"
    | "canceled";
    priority?: "none" | "low" | "medium" | "high" | "critical";
    lifeTime?: {
        begins?: string | null;
        ends?: string | null;
    };
    Tags?: string[];
};

export type Lead = LeadInput & {
    _id: string;
};

export type LeadFilters = {
    search: string;
    types?: string[];
    status?: Array<"in-progress" | "pending">;
    priority?: Array<"high" | "critical">;
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
    limit: number;
    skip: number;
};