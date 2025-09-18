'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useMemo, useEffect } from 'react';
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

import { Button } from '../../ui/button';
import { ProfileData } from '@/types/profile';
import { Spinner } from '@/components/ui/spinner';


// Base schema with all possible fields, optional where needed
const baseSchema = z.object({
    fullName: z.string().min(2, { message: 'First name is required' }),
    birthDate: z.date().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    status: z.enum(['none', 'student', 'professional', 'employee']),
    school: z.string().optional(),
    profession: z.string().optional(),
    companyName: z.string().optional(),
    activitySector: z.string().optional(),
    position: z.string().optional(),
});

// Dynamic schema to enforce required fields based on status
const createDynamicSchema = (status: string) => {
    switch (status) {
        case 'student':
            return baseSchema.refine(
                (data) => !!data.school && data.school.length >= 1,
                { message: 'School is required', path: ['school'] }
            );
        case 'professional':
            return baseSchema.refine(
                (data) => !!data.profession && data.profession.length >= 1,
                { message: 'Profession is required', path: ['profession'] }
            );
        case 'employee':
            return baseSchema.refine(
                (data) =>
                    !!data.companyName &&
                    data.companyName.length >= 1 &&
                    !!data.activitySector &&
                    data.activitySector.length >= 1 &&
                    !!data.position &&
                    data.position.length >= 1,
                {
                    message: 'Company name, activity sector, and position are required',
                    path: ['companyName', 'activitySector', 'position'],
                }
            );
        default:
            return baseSchema;
    }
};

type ProfileFormValues = z.infer<typeof baseSchema>;

interface ProfileFormProps {
    profileData: ProfileData;
    profileId: string;
    sectionName: string;
    locale: string;
}

export default function ProfileForm({ profileData, profileId, sectionName, locale }: ProfileFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>(profileData.status || 'none');
    const intl = useIntl();

    const dynamicSchema = useMemo(() => createDynamicSchema(selectedStatus), [selectedStatus]);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(dynamicSchema),
        defaultValues: {
            fullName: profileData.fullName || `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim(),
            birthDate: profileData.birthDate ? new Date(profileData.birthDate) : undefined,
            gender: profileData.gender as 'male' | 'female' | 'other' | undefined,
            status: profileData.status as 'none' | 'student' | 'professional' | 'employee' || 'none',
            school: profileData.school || '',
            profession: profileData.profession || '',
            companyName: profileData.companyName || '',
            activitySector: profileData.activitySector || '',
            position: profileData.position || '',
        },
    });

    const status = form.watch('status');

    useEffect(() => {
        if (status !== selectedStatus) {
            setSelectedStatus(status);
        }
    }, [status, selectedStatus]);

    const onSubmit = async (data: ProfileFormValues) => {
        setIsSubmitting(true);
        try {
            const formattedData = {
                ...data,
                birthDate: data.birthDate ? format(data.birthDate, 'yyyy-MM-dd') : undefined,
            };

            // Mock implementation - just show success message
            console.log('Profile update data:', formattedData);
            toast.success(intl.formatMessage({ id: 'Profile updated successfully' }));
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
                                                            'w-full ps-3 text-left font-normal border-gray-200 dark:border-blue-950',
                                                            !field.value && 'text-muted-foreground',
                                                        )}
                                                        disabled={profileData.lockedFeatures?.birthDate}
                                                    >
                                                        {field.value ? field.value.toISOString().slice(0, 10) : <FormattedMessage id="pick-a-date" />}
                                                        <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
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
                                                    <SelectValue placeholder={intl.formatMessage({ id: 'select-gender' })} />
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
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm"><FormattedMessage id="status" /></FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="border-gray-200 dark:border-blue-950">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none"><FormattedMessage id='none' /></SelectItem>
                                                <SelectItem value="student"><FormattedMessage id='student' /></SelectItem>
                                                <SelectItem value="professional"><FormattedMessage id='professional' /></SelectItem>
                                                <SelectItem value="employee"><FormattedMessage id='employee' /></SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {status === 'student' && (
                                <FormField
                                    control={form.control}
                                    name="school"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm"><FormattedMessage id="school" /></FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your school name"
                                                    {...field}
                                                    disabled={profileData.lockedFeatures?.school}
                                                    className="border-gray-200 dark:border-blue-950 focus:border-blue-500"
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {status === 'professional' && (
                                <FormField
                                    control={form.control}
                                    name="profession"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm"><FormattedMessage id="profession" /></FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your profession"
                                                    {...field}
                                                    disabled={profileData.lockedFeatures?.profession}
                                                    className="border-gray-200 dark:border-blue-950 focus:border-blue-500"
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {status === 'employee' && (
                                <>
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
                                                        value={field.value || ''}
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
                                                        value={field.value || ''}
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
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {status === 'none' && (
                                <div className="text-gray-500 text-center py-4">
                                    <FormattedMessage id="no-additional-information-required" />
                                </div>
                            )}
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
                                <Spinner className="text-white" />
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