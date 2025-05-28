import { withServerCookies } from "@/utils/withServerCookies";
import { ServerApi } from "../axios"

export const requestEmailChange = async (userId: string, email: string, newEmail: string) => {
    const headers = await withServerCookies();

    try {
        const response = await ServerApi.post(`/user/${userId}/change-email`, { email, newEmail }, { headers });
        return response.data;
    } catch (error) {
        console.error('change email error:', error);
        throw error;
    }
}

export const verifyEmailChangeOTP = async (userId: string, sessionID: string, code: string) => {
    const headers = await withServerCookies();
    try {
        const response = await ServerApi.post(`/user/${userId}/confirm-change-email/${sessionID}`, { code }, { headers });
        return response.data;
    } catch (error) {
        console.error('confirm otp error:', error);
        throw error;
    }
}
