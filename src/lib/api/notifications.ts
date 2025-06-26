import { api } from "../axios";

export const markNotificationsAsRead = async (proffileId: string, notifications: string[]): Promise<any> => {
    try {
        const response = await api.patch(`/profile/${proffileId}/notifications/apply-action`, {
            notifications,
            action: "mark-as-read"
        });
        return response;
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        throw error;
    }
} 