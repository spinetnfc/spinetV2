import { getInvitations, getNotifications } from "@/lib/api/notifications";
import { Invitation, NotificationFilters, NotificationsResponse } from "@/types/notifications"

export async function getNotificationsAction(profileId: string, filters: NotificationFilters): Promise<NotificationsResponse> {
    try {
        const response = await getNotifications(profileId, filters)
        return response;
    } catch (error) {
        console.error("Error in SerachServicesAction:", error)
        throw error
    }
}

export const getInvitationsAction = async (profileId: string, filters: { limit: string, skip: string }): Promise<Invitation[]> => {
    try {
        const response = await getInvitations(profileId, filters)
        return response;
    } catch (error) {
        console.error("Error in getInvitationsAction:", error)
        throw error
    }
}
