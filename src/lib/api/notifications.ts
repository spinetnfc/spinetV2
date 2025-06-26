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
export const acceptInvitation = async (profileId: string, invitationId: string): Promise<any> => {
    try {
        const response = await api.post(`/profile/${profileId}/invitation/${invitationId}/accept`);
        return response;
    } catch (error) {
        console.error("Error accepting invitation:", error);
        throw error;
    }
}

export const refuseInvitation = async (profileId: string, invitationId: string): Promise<any> => {
    try {
        const response = await api.post(`/profile/${profileId}/invitation/${invitationId}/refuse`);
        return response;
    } catch (error) {
        console.error("Error refusing invitation:", error);
        throw error;
    }
}