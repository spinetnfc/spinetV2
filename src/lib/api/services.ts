import { api, ServerApi } from '@/lib/axios';
import type { Service, ServiceInput } from '@/types/services';

export const getServices = async (profileId: string | null): Promise<Service[]> => {
    if (!profileId || typeof profileId !== 'string') {
        throw new Error(`Invalid profileId: ${profileId}`);
    }
    const response = await ServerApi.get(`/profile/${profileId}/services`);
    console.log("Services response received:", response.status);
    return response.data;
};

export const addService = async (profileId: string, service: ServiceInput): Promise<{ message: string }> => {
    if (!profileId || typeof profileId !== 'string') {
        throw new Error(`Invalid profileId: ${profileId}`);
    }

    const response = await api.post(`/profile/${profileId}/services`, service);
    console.log("Service added response received:", response.status);

    return response.data;
};

export const updateService = async (profileId: string, serviceId: string, service: ServiceInput): Promise<{ message: string }> => {
    if (!profileId || typeof profileId !== 'string') {
        throw new Error(`Invalid profileId: ${profileId}`);
    }
    if (!serviceId || typeof serviceId !== 'string') {
        throw new Error(`Invalid serviceId: ${serviceId}`);
    }

    const response = await api.patch(`/profile/${profileId}/service/${serviceId}`, service);
    console.log("Service updated response received:", response.status);

    return response.data;
}

export const deleteService = async (profileId: string, serviceId: string): Promise<{ message: string }> => {
    if (!profileId || typeof profileId !== 'string') {
        throw new Error(`Invalid profileId: ${profileId}`);
    }
    if (!serviceId || typeof serviceId !== 'string') {
        throw new Error(`Invalid serviceId: ${serviceId}`);
    }

    const response = await api.delete(`/profile/${profileId}/service/${serviceId}`);
    console.log("Service deleted response received:", response.status);

    return response.data;
}