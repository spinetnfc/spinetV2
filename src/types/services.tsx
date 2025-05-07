export type ServiceInput = {
    name: string,
    description: string
}

export type Service = ServiceInput & {
    _id: string;
};