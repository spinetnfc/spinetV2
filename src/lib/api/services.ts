import { ServerApi } from '@/lib/axios';
import type { Service, ServiceInput, ServicesData, ServicesSearchParams } from '@/types/services';
import { withServerCookies } from '@/utils/withServerCookies';

export const getServices = async (profileId: string | null): Promise<Service[]> => {
    if (!profileId || typeof profileId !== 'string') {
        throw new Error(`Invalid profileId: ${profileId}`);
    }
    try {
        const response = await ServerApi.get(`/profile/${profileId}/services`);
        // console.log("Services response received:", response.status);
        return response.data;
    } catch (error) {
        console.error("Error fetching services:", error);
        throw new Error(`Failed to fetch services: ${(error as Error).message}`);
    }
};

export const addService = async (profileId: string, service: ServiceInput): Promise<{ message: string }> => {
    if (!profileId || typeof profileId !== 'string') {
        throw new Error(`Invalid profileId: ${profileId}`);
    }
    const headers = await withServerCookies();

    try {
        const response = await ServerApi.post(`/profile/${profileId}/services`, service, { headers });
        console.log("Service added response received:", response.status);
        return response.data;
    } catch (error) {
        console.error("Error adding service:", error);
        throw new Error(`Failed to add service: ${(error as Error).message}`);
    }
};

export const updateService = async (profileId: string, serviceId: string, service: ServiceInput): Promise<{ message: string }> => {
    if (!profileId || typeof profileId !== 'string') {
        throw new Error(`Invalid profileId: ${profileId}`);
    }
    if (!serviceId || typeof serviceId !== 'string') {
        throw new Error(`Invalid serviceId: ${serviceId}`);
    }
    const headers = await withServerCookies();
    try {
        const response = await ServerApi.patch(`/profile/${profileId}/service/${serviceId}`, service, { headers });
        console.log("Service updated response received:", response.status);
        return response.data;
    } catch (error) {
        console.error("Error updating service:", error);
        throw new Error(`Failed to update service: ${(error as Error).message}`);
    }
}

export const deleteService = async (profileId: string, serviceId: string): Promise<{ message: string }> => {
    if (!profileId || typeof profileId !== 'string') {
        throw new Error(`Invalid profileId: ${profileId}`);
    }
    if (!serviceId || typeof serviceId !== 'string') {
        throw new Error(`Invalid serviceId: ${serviceId}`);
    }
    const headers = await withServerCookies();
    try {
        const response = await ServerApi.delete(`/profile/${profileId}/service/${serviceId}`, { headers });
        console.log("Service deleted response received:", response.status);
        return response.data;
    } catch (error) {
        console.error("Error deleting service:", error);
        throw new Error(`Failed to delete service: ${(error as Error).message}`);
    }
}

export const searchServices = async (userId: string | null, searchParams: ServicesSearchParams): Promise<ServicesData[]> => {
    if (!userId || typeof userId !== 'string') {
        throw new Error(`Invalid userId: ${userId}`);
    }
    const headers = await withServerCookies();

    try {
        const response = await ServerApi.post(`/user/${userId}/search/services`, searchParams, { headers });
        console.log("Services search response received:", response.status);
        return response.data;
    } catch (error) {
        console.error("Error searching services:", error);
        throw new Error(`Failed to search services: ${(error as Error).message}`);
    }
}