import { NotificationFilters, NotificationsResponse } from "@/types/notifications"

export async function getNotificationsAction(profileId: string, filters: NotificationFilters): Promise<NotificationsResponse> {
    try {
        const response = await getNotificationsAction(profileId, filters)
        return response
    } catch (error) {
        console.error("Error in SerachServicesAction:", error)
        throw error
    }
}
