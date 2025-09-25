export type NotificationFilters = {
    direction?: "sent" | "received";
    from?: string[];
    to?: string[];
    fromType?: "admin" | "profile";
    search?: string;
    sentRead?: boolean;
    receivedRead?: boolean;
    limit: number; // 5<limit<100
    skip: number;  // >= 0
};


export type NotificationItem = {
    _id: string;
    Company?: string;
    Invitation?: string;
    type?: "message" | "invitation" | "system-automated" | "system-manual";
    title: string;
    body: string;
    image?: string;
    from: string;
    to: string[];
    fromType: "admin" | "profile" | "company" | "system";
    toType?: "admin" | "profile";
    readBy?: string[];
    deletedBySender?: boolean;
    deletedByReceivers?: string[];
    createdAt?: string;
    updatedAt?: string;

    Sender?: {
        _id: string;
        fullName?: string;
        firstName?: string;
        lastName?: string;
        name?: string;
        subdomain?: string;
        size?: string;
        description?: string;
        website?: string;
        logo?: string;
    };

    read?: boolean;
};

export type NotificationsResponse = {
    sent?: NotificationItem[];
    received?: NotificationItem[];
};

export type Invitation = {
    _id: string;
    type: "contact";
    inviteeProfile: string;
    status: "pending" | "accepted" | "refused"; // add more if needed
    leadCaptions: {
        tags: string[];
    };
    date: string; // ISO date string

    Profile: {
        _id: string;
        type: string; // e.g., "personal"
        status: string; // e.g., "none"
        fullName: string;
        firstName: string;
        lastName: string;
        profilePicture: string;
        birthDate: string; // ISO date string
        scope: string; // e.g., "link"
        gender: string; // e.g., "male"
        companyName: string;
        activitySector: string;
        position: string;
        theme: {
            color: string;
        };
        phoneNumber: string;
        website: string;
        displayLogo: boolean;
        active: boolean;
        deactivetedByCompany: boolean;
        pending: boolean;
        Account: string;
        Contacts: any[]; // can be refined
        links: any[];    // can be refined
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
};
