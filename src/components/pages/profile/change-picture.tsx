'use client';

import { useState } from 'react';
import { Edit } from 'lucide-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import StyledFileInput from '@/components/ui/image-input';
import { updateProfileAction } from '@/actions/profile';

interface ChangePictureProps {
    profileId: string;
    pictureType: 'profilePicture' | 'coverPicture';
}

export default function ChangePicture({ profileId, pictureType }: ChangePictureProps) {
    const intl = useIntl();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (fileOrId: File | string | null) => {
        if (!(fileOrId instanceof File)) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', fileOrId);
        formData.append('name', fileOrId.name);
        formData.append('type', pictureType === 'profilePicture' ? 'profile' : 'cover');

        try {
            // Get fileApiToken from cookies
            const cookies = document.cookie.split(';').reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                acc[key] = value;
                return acc;
            }, {} as Record<string, string>);

            const fileApiToken = cookies['current-user'];
            if (!fileApiToken) {
                throw new Error('No fileApiToken found in cookies');
            }

            const user = JSON.parse(decodeURIComponent(fileApiToken));
            const token = user?.tokens?.fileApiToken;
            if (!token) {
                throw new Error('No fileApiToken available');
            }

            // Client-side file upload
            const response = await axios.post('https://files.spinetnfc.com/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const fileId = response.data;
            if (!fileId) throw new Error('No file ID returned');

            const updateData = { [pictureType]: fileId };
            const result = await updateProfileAction(profileId, updateData);

            if (result.success) {
                toast.success(
                    intl.formatMessage({
                        id: pictureType === 'profilePicture' ? 'profile_picture_updated' : 'cover_picture_updated',
                        defaultMessage: pictureType === 'profilePicture' ? 'Profile picture updated successfully' : 'Cover picture updated successfully',
                    })
                );
                setIsModalOpen(false);
            } else {
                throw new Error(result.message || 'Failed to update profile');
            }
        } catch (error: any) {
            console.error('Error uploading or updating picture:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
            toast.error(
                intl.formatMessage({
                    id: pictureType === 'profilePicture' ? 'profile_picture_update_failed' : 'cover_picture_update_failed',
                    defaultMessage: pictureType === 'profilePicture' ? 'Failed to update profile picture' : 'Failed to update cover picture',
                })
            );
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <button
                className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg"
                onClick={() => setIsModalOpen(true)}
                disabled={isUploading}
            >
                <Edit className="w-4 h-4" />
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                <FormattedMessage
                                    id={pictureType === 'profilePicture' ? 'change_profile_picture' : 'change_cover_picture'}
                                    defaultMessage={pictureType === 'profilePicture' ? 'Change Profile Picture' : 'Change Cover Picture'}
                                />
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                disabled={isUploading}
                            >
                                <FormattedMessage id="close" defaultMessage="Close" />
                            </button>
                        </div>
                        <StyledFileInput
                            onChange={handleFileChange}
                            accept="image/png,image/jpeg,image/gif"
                            isRegisterPage={false}
                            className="mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isUploading}
                            >
                                <FormattedMessage id="cancel" defaultMessage="Cancel" />
                            </Button>
                            <Button
                                onClick={() => setIsModalOpen(false)}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <FormattedMessage id="uploading" defaultMessage="Uploading..." />
                                ) : (
                                    <FormattedMessage id="save" defaultMessage="Save" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}