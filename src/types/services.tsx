export type ServiceInput = {
    name: string,
    description: string
}

export type Service = ServiceInput & {
    _id: string;
};

export type ServicesData = {
    name: string;
    description: string;
    Profile: {
        _id: string;
        firstName: string;
        lastName: string;
        profilePicture: string;
        numServices: number;
    }
}

export type ServicesSearchParams = {
    term?: string,
    skip?: number,
    limit?: number,
    priority?: "contacts" | "score",
}