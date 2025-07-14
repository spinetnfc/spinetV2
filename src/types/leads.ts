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
    notes?: string[];
};

export type Lead = {
    _id: string;
    name: string;
    description?: string;
    Contacts?: any[];
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
    Tags?: any[];
    nextActions?: any[];
    Employees?: Array<{
        _id: string;
        type: string;
        status: string;
        fullName: string;
        scope: string;
        position: string;
        displayLogo: boolean;
        active: boolean;
        deactivetedByCompany: boolean;
        pending: boolean;
        Account: string;
        Contacts: string[];
        links: Array<{
            title: string;
            name: string;
            link: string;
            isLocked: boolean;
            _id: string;
        }>;
        createdAt: string;
        updatedAt: string;
        __v: number;
        activitySector?: string;
        birthDate?: string;
        companyName?: string;
        firstName?: string;
        gender?: string;
        lastName?: string;
        theme?: {
            color: string;
        };
    }>;
    createdBy?: {
        type: string;
        creator: any;
        refModel?: string;
    };
    Attachments?: any[];
    notes?: any[];
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    mainContact?: any;
};

export type LeadFilters = {
    search: string;
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
    limit: number;
    skip: number;
};

// This type matches the API response for filtering (listing) leads
export type LeadApiResponse = {
    data: Lead[];
    total_count: number;
    current_count: number;
    skip_count: number;
};