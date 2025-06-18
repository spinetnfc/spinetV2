'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    User,
    Edit,
    Settings,
    LinkIcon,
    Globe, Linkedin, Instagram, Twitter, Github, Facebook, MapPin, ShoppingCart, Store, Smartphone, MessageCircle, Send
} from "lucide-react";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import * as z from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
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
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import AddLinkButton from '@/components/pages/profile/add-link-button';
import LinkItem from '@/components/pages/profile/link-item';
import PreferencesForm from '@/components/pages/profile/preferences-form';
import { updateProfileAction } from '@/actions/profile';
import ColorPicker from '@/components/ui/color-picker';
import { ProfileData } from '@/types/profile';

// Schema for personal information
const personalInfoSchema = z.object({
    birthDate: z.date().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    companyName: z.string().min(3, { message: 'company-name-required' }),
    activitySector: z.string().min(3, { message: 'activity-sector-required' }),
    position: z.string().min(3, { message: 'position-required' }),
});

// Schema for customization step
const customizationSchema = z.object({
    language: z.enum(['en', 'fr', 'ar']).default('en'),
    theme: z
        .object({
            color: z.string().default('#0F62FE'),
        })
        .default({ color: '#0F62FE' }),
});

export default function Onboarding({ locale, profile }: { locale: string; profile: string }) {
    const intl = useIntl();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [links, setLinks] = useState<ProfileData['links']>([]);
    const totalSteps = 3;

    const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            birthDate: undefined,
            gender: undefined,
            companyName: '',
            activitySector: '',
            position: '',
        },
    });

    const customizationForm = useForm<z.infer<typeof customizationSchema>>({
        resolver: zodResolver(customizationSchema),
        defaultValues: {
            language: 'en',
            theme: { color: '#0F62FE' },
        },
    });

    // Construct minimal ProfileData object
    const profileData: ProfileData = {
        _id: profile,
        status: 'none',
        type: '',
        groupId: '',
        theme: { color: '#0F62FE' },
        fullName: '',
        birthDate: '',
        gender: '',
        profilePicture: '',
        profileCover: '',
        links,
        lockedFeatures: {
            profileCover: false,
            logo: false,
            qrCodeLogo: false,
            displayLogo: false,
            companyName: false,
            activitySector: false,
            position: false,
            school: false,
            profession: false,
            theme: false,
            canAddLinks: true,
            canAddServices: false,
            excludedLinks: [],
        },
    };

    const nextStep = async () => {
        if (step === 1) {
            const result = await personalInfoForm.trigger();
            if (result) {
                setStep((prev) => prev + 1);
            }
        } else if (step === 3) {
            const result = await customizationForm.trigger();
            if (result) {
                setStep((prev) => prev + 1);
            }
        } else {
            setStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep((prev) => prev - 1);
        }
    };

    const skipStep = () => {
        if (step < totalSteps) {
            setStep((prev) => prev + 1);
        } else {
            router.push(`/${locale}/auth/login`);
        }
    };

    const onSubmitPersonalInfo = async (data: z.infer<typeof personalInfoSchema>) => {
        setIsSubmitting(true);
        try {
            const formattedData = {
                ...data,
                birthDate: data.birthDate ? format(data.birthDate, 'yyyy-MM-dd') : undefined,
            };
            const result = await updateProfileAction(profile, formattedData);
            if (result.success) {
                toast.success(intl.formatMessage({ id: 'Profile updated successfully' }));
                setStep((prev) => prev + 1);
            } else {
                toast.error(intl.formatMessage({ id: 'Failed to update profile. Please try again.' }));
            }
        } catch (error) {
            console.error('Client error:', error);
            toast.error(intl.formatMessage({ id: 'Something went wrong. Please try again.' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmitCustomization = async (data: z.infer<typeof customizationSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await updateProfileAction(profile, data);
            if (result.success) {
                toast.success(intl.formatMessage({ id: 'Profile updated successfully' }));
                router.push(`/${locale}/auth/login`);
            } else {
                toast.error(intl.formatMessage({ id: 'Failed to update profile. Please try again.' }));
            }
        } catch (error) {
            console.error('Client error:', error);
            toast.error(intl.formatMessage({ id: 'Something went wrong. Please try again.' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepTitle = () => {
        switch (step) {
            case 1:
                return <FormattedMessage id="personal-information" defaultMessage="Personal Information" />;
            case 2:
                return <FormattedMessage id="personal-links" defaultMessage="Personal Links" />;
            case 3:
                return <FormattedMessage id="customization" defaultMessage="Customization" />;
            default:
                return <FormattedMessage id="onboarding" />;
        }
    };

    return (
        <div className="z-50 w-full space-y-2 rounded-lg px-6 py-4 text-[#0D2C60] shadow-md dark:text-[#EEF6FF] lg:bg-white lg:dark:bg-[#010E37]">
            <div className="flex items-center justify-between">
                <h1 className="text-start text-2xl font-semibold">{renderStepTitle()}</h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    <FormattedMessage
                        id="step-of"
                        defaultMessage="Step {current} of {total}"
                        values={{ current: step, total: totalSteps }}
                    />
                </div>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                ></div>
            </div>

            {step === 1 && (
                <Form {...personalInfoForm}>
                    <form onSubmit={personalInfoForm.handleSubmit(onSubmitPersonalInfo)} className="space-y-2">
                        <FormField
                            control={personalInfoForm.control}
                            name="birthDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-sm">
                                        <FormattedMessage id="birth-date" />
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal border-gray-200 dark:border-blue-950 text-gray-400 dark:text-blue-800',
                                                        !field.value && 'text-muted-foreground',
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, 'yyyy-MM-dd')
                                                    ) : (
                                                        <span>
                                                            <FormattedMessage id="pick-a-date" defaultMessage="Pick a date" />
                                                        </span>
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
                                                restrictFutureDates={true}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={personalInfoForm.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">
                                        <FormattedMessage id="gender" />
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="border-gray-200 dark:border-blue-950 font-regular">
                                                <SelectValue
                                                    placeholder={intl.formatMessage({
                                                        id: 'select-gender',
                                                        defaultMessage: 'Select gender',
                                                    })}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="male">
                                                <FormattedMessage id="male" defaultMessage="Male" />
                                            </SelectItem>
                                            <SelectItem value="female">
                                                <FormattedMessage id="female" defaultMessage="Female" />
                                            </SelectItem>
                                            <SelectItem value="other">
                                                <FormattedMessage id="other" defaultMessage="Other" />
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={personalInfoForm.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">
                                        <FormattedMessage id="company-name" />*
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={intl.formatMessage({
                                                id: 'enter-company-name',
                                                defaultMessage: 'Enter company name',
                                            })}
                                            {...field}
                                            className="border-gray-200 dark:border-blue-950"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={personalInfoForm.control}
                            name="activitySector"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">
                                        <FormattedMessage id="activity-sector" />*
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={intl.formatMessage({
                                                id: 'enter-activity-sector',
                                                defaultMessage: 'Enter activity sector',
                                            })}
                                            {...field}
                                            className="border-gray-200 dark:border-blue-950"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={personalInfoForm.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">
                                        <FormattedMessage id="position" />*
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={intl.formatMessage({
                                                id: 'enter-position',
                                                defaultMessage: 'Enter position',
                                            })}
                                            {...field}
                                            className="border-gray-200 dark:border-blue-950"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-between mt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={skipStep}
                                className="flex items-center gap-2"
                                disabled={isSubmitting}
                            >
                                <FormattedMessage id="skip" defaultMessage="Skip" />
                            </Button>
                            <Button
                                type="submit"
                                className="flex items-center gap-2"
                                disabled={isSubmitting}
                            >
                                <FormattedMessage id="next" defaultMessage="Next" />
                                <ChevronRight size={16} className={locale === 'ar' ? 'transform rotate-180' : ''} />
                            </Button>
                        </div>
                    </form>
                </Form>
            )}

            {step === 2 && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">
                            <FormattedMessage id="personal-links" defaultMessage="Personal Links" />
                        </h2>
                        <AddLinkButton profileId={profile} profileData={profileData} />
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {links.map((link, index) => (
                            <LinkItem
                                key={index}
                                link={link}
                                index={index}
                                profileId={profile}
                                profileData={profileData}
                                themeColor="#0F62FE"
                                icon={getLinkIcon(link.name, '#0F62FE')}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className="flex items-center gap-2"
                            disabled={isSubmitting}
                        >
                            <ChevronLeft size={16} className={locale === 'ar' ? 'transform rotate-180' : ''} />
                            <FormattedMessage id="previous" defaultMessage="Previous" />
                        </Button>
                        <Button
                            type="button"
                            onClick={skipStep}
                            className="flex items-center gap-2"
                            disabled={isSubmitting}
                        >
                            <FormattedMessage id="skip" defaultMessage="Skip" />
                        </Button>
                        <Button
                            type="button"
                            onClick={nextStep}
                            className="flex items-center gap-2"
                            disabled={isSubmitting}
                        >
                            <FormattedMessage id="next" defaultMessage="Next" />
                            <ChevronRight size={16} className={locale === 'ar' ? 'transform rotate-180' : ''} />
                        </Button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <Form {...customizationForm}>
                    <form onSubmit={customizationForm.handleSubmit(onSubmitCustomization)} className="space-y-3">
                        <FormField
                            control={customizationForm.control}
                            name="language"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">
                                        <FormattedMessage id="language" />
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="border-gray-200 dark:border-blue-950">
                                                <SelectValue
                                                    placeholder={intl.formatMessage({
                                                        id: 'select-language',
                                                        defaultMessage: 'Select language',
                                                    })}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="en">
                                                <FormattedMessage id="english" defaultMessage="English" />
                                            </SelectItem>
                                            <SelectItem value="fr">
                                                <FormattedMessage id="french" defaultMessage="French" />
                                            </SelectItem>
                                            <SelectItem value="ar">
                                                <FormattedMessage id="arabic" defaultMessage="Arabic" />
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={customizationForm.control}
                            name="theme.color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm me-4">
                                        <FormattedMessage id="theme-color" />
                                    </FormLabel>
                                    <FormControl>
                                        <ColorPicker color={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-between mt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                className="flex items-center gap-2"
                                disabled={isSubmitting}
                            >
                                <ChevronLeft size={16} className={locale === 'ar' ? 'transform rotate-180' : ''} />
                                <FormattedMessage id="previous" defaultMessage="Previous" />
                            </Button>
                            <Button
                                type="button"
                                onClick={skipStep}
                                className="flex items-center gap-2"
                                disabled={isSubmitting}
                            >
                                <FormattedMessage id="skip" defaultMessage="Skip" />
                            </Button>
                            <Button
                                type="submit"
                                className="flex items-center gap-2"
                                disabled={isSubmitting}
                            >
                                <FormattedMessage id="finish" defaultMessage="Finish" />
                                {isSubmitting && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};

function getLinkIcon(linkName: string, themeColor: string) {
    switch (linkName.toLowerCase()) {
        case "website":
            return <Globe style={{ color: themeColor }} size={24} />
        case "linkedin":
            return <Linkedin style={{ color: themeColor }} size={24} />
        case "instagram":
            return <Instagram style={{ color: themeColor }} size={24} />
        case "twitter":
            return <Twitter style={{ color: themeColor }} size={24} />
        case "github":
            return <Github style={{ color: themeColor }} size={24} />
        case "facebook":
            return <Facebook style={{ color: themeColor }} size={24} />
        case "location":
            return <MapPin style={{ color: themeColor }} size={24} />
        case "order now":
            return <ShoppingCart style={{ color: themeColor }} size={24} />
        case "play store":
            return <Store style={{ color: themeColor }} size={24} />
        case "app store":
            return <Smartphone style={{ color: themeColor }} size={24} />
        case "whatsapp":
            return <MessageCircle style={{ color: themeColor }} size={24} />
        case "telegram":
            return <Send style={{ color: themeColor }} size={24} />
        case "viber":
            return <MessageCircle style={{ color: themeColor }} size={24} />
        default:
            return <LinkIcon style={{ color: themeColor }} size={24} />
    }
}