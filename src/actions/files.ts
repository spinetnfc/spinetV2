export const getFile = async (fileId: string): Promise<string> => {
    if (fileId) {
        return `${process.env.API_URL}/files/${fileId}`;
    } else {
        console.error("File ID is required to fetch the file.");
        return ""
    }
}