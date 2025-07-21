"use server";
import { getUserCookieOnServer } from '@/utils/server-cookie';
import { filesApi } from './../lib/axios';

export const getFile = async (fileId: string): Promise<string> => {
    if (fileId) {
        const filesApi = process.env.FILES_API || 'https://files.spinetnfc.com';
        const url = `${filesApi}/files/${fileId}`;
        return url;
    } else {
        console.error("File ID is required to fetch the file.");
        return "";
    }
};

export const uploadFile = async (data: FormData): Promise<string> => {
    if (!data) {
        throw new Error("No file provided for upload.");
    }
    const userCookie = await getUserCookieOnServer();
    const fileApiToken = userCookie?.tokens?.fileApiToken;
    if (!fileApiToken) {
        throw new Error("File API token is required for file uploads. Please log in again.");
    }
    try {
        const response = await filesApi.post("/upload", data, {
            headers: {
                "file-api-token": fileApiToken,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error uploading file:", {
            message: error.message,
            response: error.response
                ? {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: JSON.stringify(error.response.data, null, 2),
                }
                : "No response data available",
        });
        throw error;
    }
}