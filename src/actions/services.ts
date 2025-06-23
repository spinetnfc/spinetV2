"use server"

import { addService, updateService, deleteService, searchServices } from "@/lib/api/services"
import { ServiceInput, ServicesSearchParams } from "@/types/services"

export async function addServiceAction(profileId: string, data: ServiceInput) {
    try {
        const service = await addService(profileId, data)
        return { success: true, data: service }
    } catch (error) {
        console.error("Error in addServiceAction:", error)
        return { success: false, error: (error as Error).message }
    }
}

export async function updateServiceAction(profileId: string, serviceId: string, data: ServiceInput) {
    try {
        const service = await updateService(profileId, serviceId, data)
        return { success: true, data: service }
    } catch (error) {
        console.error("Error in updateServiceAction:", error)
        return { success: false, error: (error as Error).message }
    }
}

export async function deleteServiceAction(profileId: string, serviceId: string) {
    try {
        const response = await deleteService(profileId, serviceId)
        return { success: true, data: response }
    } catch (error) {
        console.error("Error in deleteServiceAction:", error)
        return { success: false, error: (error as Error).message }
    }
}

export async function SerachServicesAction(userId: string, searchParams: ServicesSearchParams) {
    try {
        const response = await searchServices(userId, searchParams)
        return { success: true, data: response }
    } catch (error) {
        console.error("Error in SerachServicesAction:", error)
        return { success: false, error: (error as Error).message }
    }
}
