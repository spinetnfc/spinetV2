import { api } from "../axios"
export const requestEmailChange = async (userId: string, email: string, newEmail: string) => {
    try {
        const response = await api.post(`/user/${userId}/change-email`, { email, newEmail });
        return response.data;
    } catch (error) {
        console.error('change email error:', error);
        throw error;
    }
}

export const verifyEmailChangeOTP = async (userId: string, sessionID: string, code: string) => {
    try {
        const response = await api.post(`/user/${userId}/confirm-change-email/${sessionID}`, { code });
        return response.data;
    } catch (error) {
        console.error('confirm otp error:', error);
        throw error;
    }
}
