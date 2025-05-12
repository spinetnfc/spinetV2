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
    name: string;
    description?: string;
    type?: string;
    profile: {
        fullName: string;
        type?: "professional" | string;
        groupId?: string;
        theme?: {
            color?: string;
        };
        birthDate?: string;
        gender?: "male" | "female" | string;
        companyName?: string;
        activitySector?: string;
        position?: string;
        profilePicture?: string;
        profileCover?: string;
        links?: Array<{
            name?: string;
            title?: string;
            link?: string;
        }>;
        lockedFeatures?: {
            profileCover?: boolean;
            logo?: boolean;
            qrCodeLogo?: boolean;
            displayLogo?: boolean;
            companyName?: boolean;
            activitySector?: boolean;
            position?: boolean;
            theme?: boolean;
            canAddLinks?: boolean;
            canAddServices?: boolean;
            excludedLinks?: string[];
        };
    };
    leadCaptions?: {
        metIn?: string;
        date?: string;
        tags?: string[];
        nextAction?: string;
        dateOfNextAction?: string;
        notes?: string;
    };
    teams?: string[];
};
