export type Contact = {
    name: string;
    description: string;
    leadCaptions: {
        metIn: string;
        date: string; // or Date 
        tags: string[];
        nextAction: string;
        dateOfNextAction: string;
        notes: string;
    };
    profile: {
        type: "professional" | string; // widen if other types exist
        groupId: string;
        theme: {
            color: string;
        };
        firstName: string;
        lastName: string;
        birthDate: string; // or Date
        gender: "male" | "female" | string;
        companyName: string;
        activitySector: string;
        position: string;
        profilePicture: string;
        profileCover: string;
        links: {
            title: string;
            link: string;
            name: string;
        }[];
        lockedFeatures: {
            profileCover: boolean;
            logo: boolean;
            qrCodeLogo: boolean;
            displayLogo: boolean;
            companyName: boolean;
            activitySector: boolean;
            position: boolean;
            theme: boolean;
            canAddLinks: boolean;
            canAddServices: boolean;
            excludedLinks: string[];
        };
    };
};

export type ContactInput = {
    name: string; // Required, derived from profile.fullName
    description?: string;
    type?: "scan" | "manual" | "exchange" | "spinet" | "phone";
    profile:
    | {
        fullName: string; // Required
        status?: string; // Required by previous schema (professional, employee, company, student, none)
        theme?: { color?: string };
        firstName?: string;
        lastName?: string;
        birthDate?: string;
        gender?: "male" | "female";
        companyName?: string;
        activitySector?: string;
        position?: string;
        profilePicture?: string;
        profileCover?: string;
        bio?: string;
        links?: Array<{
            title: string; // Required
            link: string; // Required
        }>;
    }
    | {
        id: string; // For existing profiles
    };
    leadCaptions?: {
        metIn?: string;
        longitude?: number;
        latitude?: number;
        date?: string; // ISO date-time
        tags?: string[];
        nextAction?: string;
        dateOfNextAction?: string; // Date format
        notes?: string;
    };
};