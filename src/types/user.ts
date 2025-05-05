export type User = {
    _id: string;
    email: string;
    firstName: string;
    position: string;
    activated?: boolean;
    createdAt: string;
    selectedProfile: string;
    tokens: {
        fileApiToken: string;
        fileApiRefreshToken: string;
    };
};
