"use server";

export const getFile = async (fileId: string): Promise<string> => {
    if (fileId) {
        const filesApi = process.env.FILES_API || 'https://files.spinetnfc.com';
        // console.log('FILES_API in getFile:', filesApi); 
        const url = `${filesApi}/files/${fileId}`;
        // console.log('Generated URL:', url); 
        return url;
    } else {
        console.error("File ID is required to fetch the file.");
        return "";
    }
};