export type LeadInput = {
    name: string;
    description?: string;
    Contacts?: string[];
    mainContact?: string | null;
    amount?: number;
    status?: | "pending" | "prospecting" | "offer-sent" | "negotiation" | "administrative-validation" | "done" | "failed" | "canceled";
    priority?: "none" | "low" | "medium" | "high" | "critical";
    lifeTime?: {
        begins?: string | null;
        ends?: string | null;
    };
    Tags?: string[];
    notes?: string[];
};

export interface AdvancedFiltersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: (filters: FilterState) => void
  currentFilters: FilterState
}
export type Priority = Lead["priority"]
export type Status = Lead["status"]

export interface FilterState {
  statuses: Status[]
  priorities: Priority[]
  dateRange: {
    startDate: string
    endDate: string
  }
  tags: string[]
  searchQuery: string
}
export type Lead = {
    _id: string;
    name: string;
    description?: string;
    amount?: number;
    mainContact?: any;
    Contacts?: string[];
    status?: | "pending" | "prospecting" | "offer-sent" | "negotiation" | "administrative-validation" | "done" | "failed" | "canceled";
    Attachments?: Array<{
        name: string;
        file: string;
        type?: | "proposal" | "contract" | "invoice" | "receipt" | "report" | "quotation-estimate" | "documentation" | "presentation" | "project-plan" | "meeting-notes" | "product-info" | "legal-document" | "correspondence" | "technical-documentation" | "document";
        fileType?: | "document" | "pdf" | "doc" | "xls" | "csv" | "pptx" | "image" | "email" | "video" | "compressed";
        createdBy?: {
            type?: "admin" | "employee";
            creator?: any;
            refModel?: "CompanyAdmin" | "Profile";
        };
        createdAt?: string;
    }>;
    priority?: "none" | "low" | "medium" | "high" | "critical";
    lifeTime?: {
        begins?: string | null;
        ends?: string | null;
    };
    Tags?: string[];
    notes?: Note[];
    nextActions?: string[];
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
    Company?: string;
    Group?: string;
    createdBy?: {
        type?: "admin" | "employee";
        creator?: any;
        refModel?: "CompanyAdmin" | "Profile";
    };
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
};


export type LeadFilters = {
    search: string;
    types?: string[];
    status?: Array<| "pending" | "prospecting" | "offer-sent" | "negotiation" | "administrative-validation" | "done" | "failed" | "canceled">;
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

export type Note = {
    _id?: string;
    note?: string;
    createdBy?: {
        type?: "admin" | "employee";
        creator?: any;
        refModel?: "CompanyAdmin" | "Profile";
    };
    createdAt?: string;
}