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
