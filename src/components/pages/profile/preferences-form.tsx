'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import * as z from 'zod';
import { ProfileData, updateProfile } from '@/lib/api/profile';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import ColorOutlet from '@/components/ui/color-outlet';
import { COLOR_PALETTE } from '@/utils/constants/colors';
// Define the validation schema for Preferences
const preferencesSchema = z.object({
    themeColor: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, { message: 'Invalid hex color' }),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

interface PreferencesFormProps {
    profileData: ProfileData;
    profileId: string;
    sectionName: string;
    locale: string
}

export default function PreferencesForm({
    profileData,
    profileId,
    sectionName,
    locale
}: PreferencesFormProps) {
    const intl = useIntl();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCustomColor, setIsCustomColor] = useState(false); // Track if color came from custom picker

    // Initialize form with default values from profileData
    const form = useForm<PreferencesFormValues>({
        resolver: zodResolver(preferencesSchema),
        defaultValues: {
            themeColor: profileData.theme?.color || '#000000',
        },
    });

    // Handle form submission
    const onSubmit = async (data: PreferencesFormValues) => {
        setIsSubmitting(true);
        try {
            // Prepare data for API
            const formattedData = {
                theme: { color: data.themeColor },
            };
            console.log('Submitting preferences data:', formattedData);
            await updateProfile(profileId, formattedData);
            toast.success('Preferences updated successfully');
        } catch (error: any) {
            console.error('Preferences update error:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'Failed to update preferences. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update isCustomColor when themeColor changes
    const handleColorChange = (value: string) => {
        form.setValue('themeColor', value);
        setIsCustomColor(!COLOR_PALETTE.includes(value)); // Set to true if not in palette
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Theme Settings</h2>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="themeColor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Theme Color</FormLabel>
                                        <FormControl>
                                            <div className="my-3 w-fit xl:w-[90%] grid grid-rows-2 xl:inline-flex space-x-6 space-y-2 grid-flow-col ">
                                                <div
                                                    className={`picker h-[30px] w-[30px] rounded-full cursor-pointer ${isCustomColor ? 'border-2 border-primary' : ''}`}
                                                    style={{
                                                        background: isCustomColor
                                                            ? field.value
                                                            : 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                                                    }}
                                                >
                                                    <input
                                                        title="Custom color"
                                                        type="color"
                                                        className="h-[25px] w-[25px] rounded-full border-none opacity-0 outline-none"
                                                        value={field.value}
                                                        onChange={(e) => handleColorChange(e.target.value)}
                                                        disabled={profileData.lockedFeatures?.theme}
                                                    />
                                                </div>
                                                {COLOR_PALETTE.map((color) => (
                                                    <div
                                                        key={color}
                                                        className={profileData.lockedFeatures?.theme ? 'cursor-not-allowed opacity-50' : ''}
                                                        onClick={profileData.lockedFeatures?.theme ? undefined : () => handleColorChange(color)}
                                                    >
                                                        <ColorOutlet
                                                            color={color}
                                                            onUpdate={() => { }} // No-op since click is handled by wrapper
                                                            isChecked={field.value === color}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Feature Access</h2>
                        <div className="space-y-2">
                            {Object.entries(profileData.lockedFeatures || {}).map(([feature, isLocked]) =>
                                feature !== 'excludedLinks' ? (
                                    <div key={feature} className="flex items-center justify-between px-4 py-2 border rounded">
                                        <span className="capitalize">{feature.replace(/([A-Z])/g, ' $1')}</span>
                                        <span className={isLocked ? 'text-red-500' : 'text-green-500'}>
                                            {isLocked ? 'Locked' : 'Unlocked'}
                                        </span>
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </div>
            </form>
        </Form >
    );
}