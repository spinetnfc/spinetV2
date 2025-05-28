export type ProfileData = {
    type: string;
    groupId: string;
    theme: {
        color: string;
    };
    firstName?: string;
    fullName: string;
    lastName?: string;
    birthDate: string;
    gender: string;
    phoneNumber?: string;
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
        firstName?: boolean;
        lastName?: boolean;
        birthDate?: boolean;
        gender?: boolean;
    };
}

export type LinkType = {
    name: string
    title: string
    link: string
}