'use client';

import { useState } from 'react';
import { Edit, X } from 'lucide-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import StyledFileInput from '@/components/ui/image-input';

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
            // Mock file upload - replace with hardcoded behavior
            const fileId = "mock-file-id-" + Date.now();
            console.log("Mock file upload:", fileOrId.name, pictureType);

            const updateData = { [pictureType]: fileId };
            // Mock update - replace with hardcoded behavior
            console.log("Mock profile picture update:", updateData);

            toast.success(
                intl.formatMessage({
                    id: pictureType === 'profilePicture' ? 'profile-picture-updated' : 'cover-picture-updated',
                    defaultMessage: pictureType === 'profilePicture' ? 'Profile picture updated successfully' : 'Cover picture updated successfully',
                })
            );
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error uploading or updating picture:', error);
            toast.error(
                intl.formatMessage({
                    id: pictureType === 'profilePicture' ? 'profile-picture-update-failed' : 'cover-picture-update-failed',
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
                className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg cursor-pointer"
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
                                    id={pictureType === 'profilePicture' ? 'change-profile-picture' : 'change-cover-picture'}
                                    defaultMessage={pictureType === 'profilePicture' ? 'Change Profile Picture' : 'Change Cover Picture'}
                                />
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                disabled={isUploading}
                            >
                                <X />
                            </button>
                        </div>
                        <StyledFileInput
                            onChange={handleFileChange}
                            accept="image/png,image/jpeg,image/gif"
                            isRegisterPage={false} // Upload file immediately
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