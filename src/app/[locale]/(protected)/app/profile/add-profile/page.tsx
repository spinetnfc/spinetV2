'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'sonner';
import { createProfileAction } from '@/actions/profile';
import { getUserFromCookie } from '@/utils/cookie';
import { useRouter } from 'next/navigation';
import { profileInput } from '@/types/profile';
import { useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Complete schema with all possible fields
const profileSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name is required' }),
    phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
    role: z.enum(['student', 'employee', 'professional', 'none']),
    // Optional fields for all roles
    school: z.string().optional(),
    profession: z.string().optional(),
    companyName: z.string().optional(),
    activitySector: z.string().optional(),
    position: z.string().optional(),
    links: z.array(z.object({
        name: z.string(),
        title: z.string(),
        link: z.string(),
    })).optional(),
    profilePicture: z.string().optional(),
    profileCover: z.string().optional(),
});

// Dynamic validation based on role
const createDynamicSchema = (role: string) => {
    const baseValidation = profileSchema.pick({
        fullName: true,
        phoneNumber: true,
        role: true,
        links: true,
        profilePicture: true,
        profileCover: true,
    });

    switch (role) {
        case 'student':
            return baseValidation.extend({
                school: z.string().min(1, { message: 'School is required' }),
            });
        case 'professional':
            return baseValidation.extend({
                profession: z.string().min(1, { message: 'Profession is required' }),
            });
        case 'employee':
            return baseValidation.extend({
                companyName: z.string().min(1, { message: 'Company name is required' }),
                activitySector: z.string().min(1, { message: 'Activity sector is required' }),
                position: z.string().min(1, { message: 'Position is required' }),
            });
        case 'none':
        default:
            return baseValidation;
    }
};

type ProfileFormValues = z.infer<typeof profileSchema>;

const LINK_TYPES = [
    'website', 'linkedin', 'instagram', 'twitter', 'github', 'email', 'phone',
    'facebook', 'location', 'order now', 'play store', 'app store', 'whatsapp',
    'telegram', 'viber', 'other',
];

const AddProfilePage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [links, setLinks] = useState<{ name: string; title: string; link: string; }[]>([]);
    const [newLink, setNewLink] = useState<{ name: string; title: string; link: string; }>({ name: '', title: '', link: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>('none');
    const intl = useIntl();
    const router = useRouter();
    const user = getUserFromCookie();

    // Create dynamic schema based on selected role
    const dynamicSchema = useMemo(() => createDynamicSchema(selectedRole), [selectedRole]);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(dynamicSchema),
        defaultValues: {
            fullName: '',
            phoneNumber: '',
            role: 'none',
            school: '',
            profession: '',
            companyName: '',
            activitySector: '',
            position: '',
            links: [],
        },
    });

    const role = form.watch('role');

    // Update selected role when form role changes
    useEffect(() => {
        if (role !== selectedRole) {
            setSelectedRole(role);
            // Update resolver with new schema but keep all values
            const currentValues = form.getValues();
            // Don't reset, just update the resolver
        }
    }, [role, selectedRole, form]);

    const handleAddLink = () => {
        if (!newLink.name || !newLink.title || !newLink.link) {
            toast.error(intl.formatMessage({ id: 'Please fill in all link fields' }));
            return;
        }
        setLinks([...links, newLink]);
        setNewLink({ name: '', title: '', link: '' });
    };

    const handleRemoveLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const validateStep = async (step: number) => {
        if (step === 1) {
            const result = await form.trigger(['fullName', 'phoneNumber']);
            if (!result) {
                toast.error(intl.formatMessage({ id: 'Please fill in all required fields' }));
                return false;
            }
        } else if (step === 2) {
            const fieldsToValidate = ['role'];
            if (role === 'student') fieldsToValidate.push('school');
            if (role === 'professional') fieldsToValidate.push('profession');
            if (role === 'employee') fieldsToValidate.push('companyName', 'activitySector', 'position');

            const result = await form.trigger(fieldsToValidate as any);
            if (!result) {
                const errorMessage = role === 'student' && !form.getValues('school') ? 'School is required' :
                    role === 'professional' && !form.getValues('profession') ? 'Profession is required' :
                        role === 'employee' && (!form.getValues('companyName') || !form.getValues('activitySector') || !form.getValues('position')) ? 'Company name, activity sector, and position are required' :
                            'Please fill in all required fields';
                toast.error(intl.formatMessage({ id: errorMessage }));
                return false;
            }
        }
        return true;
    };

    const handleNextStep = async () => {
        const isValid = await validateStep(currentStep);
        if (isValid) {
            if (currentStep < 4) {
                setCurrentStep((prev) => prev + 1);
            }
        }
    };


    // create clean profile data with only relevant fields
    const createProfileData = (data: ProfileFormValues): profileInput => {
        const baseData = {
            status: data.role,
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            links: links,
            profilePicture: data.profilePicture,
            profileCover: data.profileCover,
        };

        // Add role-specific fields only if they're not empty
        const profileData: profileInput = { ...baseData };

        if (data.role === 'student' && data.school && data.school.trim() !== '') {
            profileData.school = data.school;
        }

        if (data.role === 'professional' && data.profession && data.profession.trim() !== '') {
            profileData.profession = data.profession;
        }

        if (data.role === 'employee') {
            if (data.companyName && data.companyName.trim() !== '') {
                profileData.companyName = data.companyName;
            }
            if (data.activitySector && data.activitySector.trim() !== '') {
                profileData.activitySector = data.activitySector;
            }
            if (data.position && data.position.trim() !== '') {
                profileData.position = data.position;
            }
        }

        return profileData;
    };

    const onSubmit = async (data: ProfileFormValues) => {
        if (!user?._id) {
            toast.error(intl.formatMessage({ id: 'User not found' }));
            return;
        }

        setIsSubmitting(true);
        try {
            const profileData = createProfileData(data);

            const result = await createProfileAction(user._id, profileData);
            if (result.success) {
                toast.success(intl.formatMessage({ id: 'Profile created successfully' }));
                router.push('/app');
            } else {
                toast.error(result.message || intl.formatMessage({ id: 'Failed to create profile' }));
            }
        } catch (error) {
            console.error('Error creating profile:', error);
            toast.error(intl.formatMessage({ id: 'Something went wrong' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">
                <FormattedMessage id="personal-information" />
            </h2>
            <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel><FormattedMessage id="full-name" /></FormLabel>
                        <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel><FormattedMessage id="phone-number" /></FormLabel>
                        <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">
                <FormattedMessage id="professional-information" />
            </h2>
            <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel><FormattedMessage id="role" /></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="employee">Employee</SelectItem>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {role === 'student' && (
                <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel><FormattedMessage id="school" /></FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your school name" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            {role === 'professional' && (
                <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel><FormattedMessage id="profession" /></FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your profession" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            {role === 'employee' && (
                <>
                    <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel><FormattedMessage id="company-name" /></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your company name" {...field} value={field.value || ''} />
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
                                <FormLabel><FormattedMessage id="activity-sector" /></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your activity sector" {...field} value={field.value || ''} />
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
                                <FormLabel><FormattedMessage id="position" /></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your position" {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
            )}
            {role === 'none' && (
                <div className="text-gray-500 text-center py-4">
                    <FormattedMessage id="no-additional-information-required" />
                </div>
            )}
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">
                <FormattedMessage id="links" />
            </h2>
            <div className="space-y-4">
                <div className="flex gap-4">
                    <Select value={newLink.name} onValueChange={(value) => setNewLink({ ...newLink, name: value })}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select link type" />
                        </SelectTrigger>
                        <SelectContent>
                            {LINK_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Display text"
                        value={newLink.title}
                        onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    />
                    <Input
                        placeholder="URL"
                        value={newLink.link}
                        onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
                    />
                    <Button onClick={handleAddLink}>Add</Button>
                </div>
                <div className="space-y-2">
                    {links.map((link, index) => (
                        <Card key={index} className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{link.title}</p>
                                    <p className="text-sm text-gray-500">{link.link}</p>
                                </div>
                                <Button variant="destructive" size="sm" onClick={() => handleRemoveLink(index)}>
                                    Remove
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">
                <FormattedMessage id="profile-images" />
            </h2>
            <FormField
                control={form.control}
                name="profilePicture"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel><FormattedMessage id="profile-picture" /></FormLabel>
                        <FormControl>
                            <Input type="file" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    field.onChange('placeholder_url');
                                }
                            }} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="profileCover"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel><FormattedMessage id="cover-image" /></FormLabel>
                        <FormControl>
                            <Input type="file" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    field.onChange('placeholder_url');
                                }
                            }} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );

    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">
                    <FormattedMessage id="add-profile" />
                </h1>
                <Form {...form}>
                    <div className="space-y-6">
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                        {currentStep === 4 && renderStep4()}
                        <div className="flex justify-between">
                            {currentStep > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                >
                                    <FormattedMessage id="previous" />
                                </Button>
                            )}
                            {currentStep < 4 ? (
                                <Button
                                    type="button"
                                    onClick={handleNextStep}
                                >
                                    <FormattedMessage id="next" />
                                </Button>
                            ) : (
                                <Button type="submit" disabled={isSubmitting} onSubmit={form.handleSubmit(onSubmit)}>
                                    {isSubmitting ? (
                                        <FormattedMessage id="creating" />
                                    ) : (
                                        <FormattedMessage id="create-profile" />
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default AddProfilePage;