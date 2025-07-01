export const getFile = async (fileId: string): Promise<string> => {
    console.log(process.env.FILES_API);
    if (fileId) {
        return `${process.env.FILES_API}/files/${fileId}`;
    } else {
        console.error("File ID is required to fetch the file.");
        return ""
    }
}