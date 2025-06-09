export type ProfileData = {
    _id?: string;
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

export type profileInput = {
    status: 'professional' | 'employee' | 'company' | 'student' | 'none';
    code?: string;
    theme?: { color: string };
    profileName?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    profileCover?: string;
    logo?: string;
    qrCodeLogo?: string;
    displayLogo?: boolean;
    bio?: string;
    phoneNumber?: string;
    website?: string;
    birthDate?: string;
    gender?: 'male' | 'female';
    companyName?: string;
    school?: string;
    activitySector?: string;
    position?: string;
    profession?: string;
    sensitiveInfo?: {
        bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
        illnesses?: { name: string; details?: string }[];
    };
    links?: { name: string; title: string; link: string; order?: number }[];
};
export type LinkType = {
    name: string
    title: string
    link: string
}