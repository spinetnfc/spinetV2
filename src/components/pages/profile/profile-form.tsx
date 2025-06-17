'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import * as z from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

import { updateProfileAction } from '@/actions/profile';
import { Button } from '../../ui/button';

// Validation schema
const profileSchema = z.object({
    fullName: z.string().min(2, { message: 'First name is required' }),
    birthDate: z.date().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    companyName: z.string().min(1, { message: 'Company name is required' }),
    activitySector: z.string().min(1, { message: 'Activity sector is required' }),
    position: z.string().min(1, { message: 'Position is required' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    profileData: any; // You can keep your ProfileData type here
    profileId: string;
    sectionName: string;
    locale: string;
}

export default function ProfileForm({ profileData, profileId, sectionName, locale }: ProfileFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const intl = useIntl();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: profileData.fullName ? profileData.fullName : `${profileData.firstName} ${profileData.lastName}`,
            birthDate: profileData.birthDate ? new Date(profileData.birthDate) : undefined,
            gender: profileData.gender as 'male' | 'female' | 'other' || undefined,
            companyName: profileData.companyName || '',
            activitySector: profileData.activitySector || '',
            position: profileData.position || '',
        },
    });

    const onSubmit = async (data: ProfileFormValues) => {
        setIsSubmitting(true);
        try {
            const formattedData = {
                ...data,
                birthDate: data.birthDate ? format(data.birthDate, 'yyyy-MM-dd') : undefined,
            };
            // Call server action (server-side formatting & API call)
            const result = await updateProfileAction(profileId, formattedData);

            if (result.success) {
                toast.success(intl.formatMessage({ id: 'Profile updated successfully' }));
            } else {
                toast.error(result.message || intl.formatMessage({ id: 'Failed to update profile. Please try again.' }));
            }
        } catch (error) {
            console.error('Client error:', error);
            toast.error(intl.formatMessage({ id: 'Something went wrong. Please try again.' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold"><FormattedMessage id="basic-information" /></h2>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm"><FormattedMessage id="full-name" /></FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your first name"
                                                {...field}
                                                disabled={profileData.lockedFeatures?.firstName}
                                                className="border-gray-200 dark:border-blue-950 focus:border-blue-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="birthDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-sm"><FormattedMessage id="birth-date" /></FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        type="button"
                                                        className={cn(
                                                            'w-full pl-3 text-left font-normal border-gray-200 dark:border-blue-950',
                                                            !field.value && 'text-muted-foreground',
                                                        )}
                                                        disabled={profileData.lockedFeatures?.birthDate}
                                                    >
                                                        {field.value ? field.value.toISOString().slice(0, 10) : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm"><FormattedMessage id="gender" /></FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={profileData.lockedFeatures?.gender}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="border-gray-200 dark:border-blue-950">
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="male"><FormattedMessage id="male" /></SelectItem>
                                                <SelectItem value="female"><FormattedMessage id="female" /></SelectItem>
                                                <SelectItem value="other"><FormattedMessage id="other" /></SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold"><FormattedMessage id="professional-information" /></h2>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm"><FormattedMessage id="company-name" /></FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter company name"
                                                {...field}
                                                disabled={profileData.lockedFeatures?.companyName}
                                                className="border-gray-200 dark:border-blue-950 focus:border-blue-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="activitySector"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm"><FormattedMessage id="activity-sector" /></FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter activity sector"
                                                {...field}
                                                disabled={profileData.lockedFeatures?.activitySector}
                                                className="border-gray-200 dark:border-blue-950 focus:border-blue-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm"><FormattedMessage id="position" /></FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your position"
                                                {...field}
                                                disabled={profileData.lockedFeatures?.position}
                                                className="border-gray-200 dark:border-blue-950 focus:border-blue-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div>
                                <FormLabel className="text-sm"><FormattedMessage id="profile-type" /></FormLabel>
                                <Input
                                    value={profileData.type}
                                    disabled
                                    className="border-gray-200 dark:border-blue-950"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 btn btn-primary"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full" />
                                <span><FormattedMessage id="saving" /></span>
                            </>
                        ) : (
                            <FormattedMessage id="save" />
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
