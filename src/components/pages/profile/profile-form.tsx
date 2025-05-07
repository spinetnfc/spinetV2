'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { toast } from "sonner";

// Define the validation schema
const profileSchema = z.object({
    // Basic Information
    fullName: z.string().min(2, { message: 'First name is required' }),
    // lastName: z.string().min(2, { message: 'Last name is required' }),
    birthDate: z.date().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    phoneNumber: z
        .string()
        .min(1, { message: 'phone-number-required' })
        .regex(/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, {
            message: 'invalid-phone-number',
        }),
    // Professional Information
    companyName: z.string().min(1, { message: 'Company name is required' }),
    activitySector: z.string().min(1, { message: 'Activity sector is required' }),
    position: z.string().min(1, { message: 'Position is required' }),

    // Social Links
    links: z.array(z.object({
        title: z.string().min(1, { message: 'Platform is required' }),
        link: z.string().min(1, { message: 'URL is required' }),
        name: z.string().min(1, { message: 'Display name is required' }),
    })).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    profileData: ProfileData;
    profileId: string;
    sectionName: string;
    locale: string;
}

export default function ProfileForm({ profileData, profileId, sectionName, locale }: ProfileFormProps) {
    const intl = useIntl();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with default values from profileData
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: profileData.fullName ? profileData.fullName : `${profileData.firstName} ${profileData.lastName}`,
            // lastName: profileData.lastName || '',
            birthDate: profileData.birthDate ? new Date(profileData.birthDate) : undefined,
            gender: profileData.gender as 'male' | 'female' | 'other' || undefined,
            phoneNumber: profileData.phoneNumber || '',
            companyName: profileData.companyName || '',
            activitySector: profileData.activitySector || '',
            position: profileData.position || '',
            links: profileData.links || [],
        },
    });

    // Setup field array for social links
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "links",
    });

    // Handle form submission
    const onSubmit = async (data: ProfileFormValues) => {
        setIsSubmitting(true);
        try {
            // Convert data to match the API expectations
            const formattedData = {
                ...data,
                birthDate: data.birthDate ? format(data.birthDate, 'yyyy-MM-dd') : undefined,
            };
            updateProfile(profileId, formattedData);
            console.log('Submitting profile data:', formattedData);
            await updateProfile(profileId, formattedData);

            toast.success("Profile updated successfully");
        } catch (error: any) {
            console.error('Profile update error:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'Failed to update profile. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Basic Information</h2>
                        <div className="space-y-4">
                            {/* First Name Field */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Full Name</FormLabel>
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

                            {/* Last Name Field */}
                            {/* <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Last Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your last name"
                                                {...field}
                                                disabled={profileData.lockedFeatures?.lastName}
                                                className="border-gray-200 dark:border-blue-950 focus:border-blue-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}

                            {/* Birth Date Field */}
                            <FormField
                                control={form.control}
                                name="birthDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-sm">Birth Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            'w-full pl-3 text-left font-normal border-gray-200 dark:border-blue-950',
                                                            !field.value && 'text-muted-foreground',
                                                        )}
                                                        disabled={profileData.lockedFeatures?.birthDate}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, 'yyyy-MM-dd')
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                // disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Gender Field */}
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Gender</FormLabel>
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
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Phone Number Field */}
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Phone number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your phone number"
                                                {...field}
                                                // disabled={profileData.lockedFeatures?.phoneNumber}
                                                className="border-gray-200 dark:border-blue-950 focus:border-blue-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Professional Information</h2>
                        <div className="space-y-4">
                            {/* Company Name Field */}
                            <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Company Name</FormLabel>
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

                            {/* Activity Sector Field */}
                            <FormField
                                control={form.control}
                                name="activitySector"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Activity Sector</FormLabel>
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

                            {/* Position Field */}
                            <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Position</FormLabel>
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

                            {/* Profile Type Field (Read-only) */}
                            <div>
                                <FormLabel className="text-sm">Profile Type</FormLabel>
                                <Input
                                    value={profileData.type}
                                    disabled
                                    className="border-gray-200 dark:border-blue-950"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Links Section */}
                {profileData.lockedFeatures?.canAddLinks && (
                    <div className="space-y-4 mt-8">
                        <h2 className="text-lg font-semibold">Social Links</h2>
                        <div className="space-y-4">
                            {fields.length > 0 ? (
                                fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-2 gap-4 p-4 border rounded-lg relative">
                                        <div>
                                            <FormField
                                                control={form.control}
                                                name={`links.${index}.title`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm">Platform</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="e.g., LinkedIn"
                                                                {...field}
                                                                className="border-gray-200 dark:border-blue-950 focus:border-blue-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <FormField
                                                control={form.control}
                                                name={`links.${index}.link`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm">URL/Username</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="e.g., https://linkedin.com/in/username"
                                                                {...field}
                                                                className="border-gray-200 dark:border-blue-950 focus:border-blue-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`links.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm">Display Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="e.g., John Doe"
                                                                {...field}
                                                                className="border-gray-200 dark:border-blue-950 focus:border-blue-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No social links added yet.</p>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => append({ title: '', link: '', name: '' })}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add New Link
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex justify-end mt-6">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                    >
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
        </Form>
    );
} 