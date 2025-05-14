export type Contact = {
    _id: string;
    name: string; // Required, derived from profile.fullName
    description?: string;
    type?: "scan" | "manual" | "exchange" | "spinet" | "phone";
    Profile:
    | {
        fullName: string; // Required
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

export type ContactInput = {
    name: string; // Required, derived from profile.fullName
    description?: string;
    type?: "scan" | "manual" | "exchange" | "spinet" | "phone";
    profile:
    | {
        fullName: string; // Required
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