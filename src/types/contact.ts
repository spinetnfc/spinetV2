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
        companyName: string; // Typo?
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
    name?: string;
    description?: string;
    type?: string; // Optional, defaults to "manual"
    profile: {
        fullName: string; // Typically required
        firstName?: string;
        lastName?: string;
        companyName?: string;
        position?: string;
        sector?: string;
        bio?: string;
        links?: Array<{
            name: string;
            title: string;
            link: string;
        }>;
        tags?: string[];
        profilePicture?: string;
        logo?: string;
    };
    leadCaptions?: {
        metIn?: string;
        longitude?: number;
        latitude?: number;
        date?: string; // ISO date string (e.g., "2025-05-15T00:00:00.000Z")
        tags?: string[];
        nextAction?: string;
        dateOfNextAction?: string; // ISO date string or "yyyy-MM-dd"
        notes?: string;
    };
    teams?: string[]; // Array of team IDs (MongoDB ObjectIds)
};
