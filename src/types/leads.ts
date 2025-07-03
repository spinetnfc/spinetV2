export type Lead = {
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
