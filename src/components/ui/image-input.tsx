'use client';

import { useState, useRef } from 'react';
import { Upload, ImageIcon, X } from 'lucide-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'sonner';
import { uploadFile } from '@/actions/files';

interface StyledFileInputProps {
    onChange: (fileOrId: File | string | null) => void;
    accept?: string;
    className?: string;
    isRegisterPage?: boolean;
}

export default function StyledFileInput({
    onChange,
    accept = 'image/*',
    className = '',
    isRegisterPage = false,
}: StyledFileInputProps) {
    const intl = useIntl();
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (file: File | null) => {
        setSelectedFile(file);
        let result: File | string | null = file;

        if (file && !isRegisterPage) {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', file.name);
            formData.append('type', 'profile');

            try {
                result = await uploadFile(formData); // Upload and get file ID
                toast.success(intl.formatMessage({ id: 'file_upload_success', defaultMessage: 'File uploaded successfully' }));
            } catch (error) {
                console.error('Error uploading file:', error);
                toast.error(intl.formatMessage({ id: 'file_upload_failed', defaultMessage: 'Failed to upload file' }));
                setLoading(false);
                setPreview(null);
                onChange(null);
                return;
            }
        }

        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }

        setLoading(false);
        onChange(result); // Pass File or file ID to parent
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFileChange(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileChange(files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        setPreview(null);
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`relative ${className}`}>
            <input
                ref={fileInputRef}
                type='file'
                accept={accept}
                onChange={handleInputChange}
                className='hidden'
                disabled={loading}
            />
            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative overflow-hidden cursor-pointer transition-all duration-300 ease-in-out
          border-2 border-dashed rounded-xl p-8
          ${isDragOver
                        ? 'border-azure dark:border-gray-300 bg-blue-100 dark:bg-navy'
                        : 'border-gray-300 dark:border-azure hover:border-blue-400 dark:hover:border-azure'
                    }
        `}
            >
                <div className='relative z-10 flex flex-col items-center justify-center space-y-4'>
                    {preview ? (
                        <div className='relative p-2'>
                            <img
                                src={preview || '/placeholder.svg'}
                                alt='Preview'
                                className='aspect-square w-32 sm:w-40 object-cover shadow-lg border border-white dark:border-gray-700'
                            />
                            <button
                                onClick={handleRemove}
                                className='absolute top-0 end-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors'
                            >
                                <X className='w-3 h-3' />
                            </button>
                        </div>
                    ) : (
                        <div
                            className={`
                p-4 rounded-full transition-all duration-300
                ${isDragOver
                                    ? 'bg-azure text-white scale-110'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-lg'
                                }
              `}
                        >
                            {isDragOver ? <Upload className='w-8 h-8 animate-bounce' /> : <ImageIcon className='w-8 h-8' />}
                        </div>
                    )}
                    <div className='text-center'>
                        {selectedFile ? (
                            <div>
                                <p className='text-sm font-medium text-azure dark:text-azure'>
                                    File selected: {selectedFile.name}
                                </p>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                    <FormattedMessage id='click_to_change' defaultMessage='Click to change or drag a new file' />
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className='text-lg font-semibold text-gray-700 dark:text-gray-200'>
                                    {isDragOver ? <FormattedMessage id='drop_image' /> : <FormattedMessage id='upload_image' />}
                                </p>
                                <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
                                    <FormattedMessage id='drag_drop_browse' />
                                </p>
                                <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
                                    <FormattedMessage id='image_formats' />
                                </p>
                            </div>
                        )}
                        {loading && (
                            <p className='text-sm text-gray-500'>
                                <FormattedMessage id='uploading' defaultMessage='Uploading...' />
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}