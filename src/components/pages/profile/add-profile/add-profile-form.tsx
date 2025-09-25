'use client'

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { profileInput } from '@/types/profile';
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
import StyledFileInput from '@/components/ui/image-input';

// Define props interface
interface AddProfileFormProps {
    user: { _id: string } | null;
    linkTypes: string[];
    roleOptions: string[];
}

// Schema definition
const profileSchema = z.object({
    fullName: z.string().min(3, { message: 'fullname-required' }),
    phoneNumber: z.string()
        .optional()
        .refine(
            (value) => !value || value.length === 0 ||
                (value.length >= 10 && /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(value)),
            { message: 'invalid-phone-number' }
        ),
    role: z.enum(['student', 'employee', 'professional', 'none']),
    school: z.string().min(3, { message: 'school-required' }).optional(),
    profession: z.string().min(3, { message: 'profession-required' }).optional(),
    companyName: z.string().min(3, { message: 'company-name-required' }),
    activitySector: z.string().min(3, { message: 'activity-sector-required' }),
    position: z.string().min(3, { message: 'position-required' }),
    links: z
        .array(z.object({ name: z.string(), title: z.string(), link: z.string() }))
        .optional(),
    profilePicture: z.string().optional(),
    profileCover: z.string().optional(),
});

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
        default:
            return baseValidation;
    }
};

type ProfileFormValues = z.infer<typeof profileSchema>;

const AddProfileForm = ({ user, linkTypes, roleOptions }: AddProfileFormProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [links, setLinks] = useState<{ name: string; title: string; link: string }[]>([]);
    const [newLink, setNewLink] = useState<{ name: string; title: string; link: string }>({
        name: '',
        title: '',
        link: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>('none');
    const intl = useIntl();
    const router = useRouter();

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

    useEffect(() => {
        if (role !== selectedRole) {
            setSelectedRole(role);
        }
    }, [role, selectedRole]);

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
            const result = await form.trigger(['fullName']);
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
                const errorMessage =
                    role === 'student' && !form.getValues('school')
                        ? 'School is required'
                        : role === 'professional' && !form.getValues('profession')
                            ? 'Profession is required'
                            : role === 'employee' &&
                                (!form.getValues('companyName') ||
                                    !form.getValues('activitySector') ||
                                    !form.getValues('position'))
                                ? 'Company name, activity sector, and position are required'
                                : 'Please fill in all required fields';
                toast.error(intl.formatMessage({ id: errorMessage }));
                return false;
            }
        }
        return true;
    };

    const handleNextStep = async () => {
        const isValid = await validateStep(currentStep);
        if (isValid && currentStep < 4) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleSubmit = async (data: ProfileFormValues) => {
        if (!user?._id) {
            toast.error(intl.formatMessage({ id: 'User not found' }));
            return;
        }
        setIsSubmitting(true);
        try {
            const profileData = createProfileData(data);
            // Mock create profile - replace with hardcoded behavior
            console.log("Mock create profile:", profileData);
            toast.success(intl.formatMessage({ id: 'Profile created successfully' }));
            router.push('/app');
        } catch (error) {
            console.error('Error creating profile:', error);
            toast.error(intl.formatMessage({ id: 'Something went wrong' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const createProfileData = (data: ProfileFormValues): profileInput => {
        const baseData = {
            status: data.role,
            fullName: data.fullName,
            links: links,
            profilePicture: data.profilePicture,
            profileCover: data.profileCover,
        };
        const profileData: profileInput = { ...baseData };
        if (data.phoneNumber && data.phoneNumber.trim() !== '') {
            profileData.phoneNumber = data.phoneNumber;
        }
        if (data.role === 'student' && data.school && data.school.trim() !== '') profileData.school = data.school;
        if (data.role === 'professional' && data.profession && data.profession.trim() !== '') profileData.profession = data.profession;
        if (data.role === 'employee') {
            if (data.companyName && data.companyName.trim() !== '') profileData.companyName = data.companyName;
            if (data.activitySector && data.activitySector.trim() !== '') profileData.activitySector = data.activitySector;
            if (data.position && data.position.trim() !== '') profileData.position = data.position;
        }
        return profileData;
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
                        <FormLabel>
                            <FormattedMessage id="full-name" />
                        </FormLabel>
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
                        <FormLabel>
                            <FormattedMessage id="phone-number" />
                        </FormLabel>
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
                        <FormLabel>
                            <FormattedMessage id="role" />
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {roleOptions.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </SelectItem>
                                ))}
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
                            <FormLabel>
                                <FormattedMessage id="school" />
                            </FormLabel>
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
                            <FormLabel>
                                <FormattedMessage id="profession" />
                            </FormLabel>
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
                                <FormLabel>
                                    <FormattedMessage id="company-name" />
                                </FormLabel>
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
                                <FormLabel>
                                    <FormattedMessage id="activity-sector" />
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter activity sector" {...field} value={field.value || ''} />
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
                                <FormLabel>
                                    <FormattedMessage id="position" />
                                </FormLabel>
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
                            {linkTypes.map((type) => (
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
                        <FormLabel className="text-sm">
                            <FormattedMessage id="profile-picture" defaultMessage="Profile Picture" />
                        </FormLabel>
                        <FormControl>
                            <StyledFileInput
                                onChange={() => {
                                    const handleFileChange = (file: File | null) => {
                                        if (file) {
                                            console.log("Selected file:", file.name)
                                        } else {
                                            console.log("No file selected")
                                        }
                                    }
                                }}
                            />
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
                        <FormLabel className="text-sm">
                            <FormattedMessage id="cover-image" defaultMessage="Cover image" />
                        </FormLabel>
                        <FormControl>
                            <StyledFileInput
                                onChange={() => {
                                    const handleFileChange = (file: File | null) => {
                                        if (file) {
                                            console.log("Selected file:", file.name)
                                        } else {
                                            console.log("No file selected")
                                        }
                                    }
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {/* <FormField
                control={form.control}
                name="profilePicture"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            <FormattedMessage id="profile-picture" />
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        field.onChange('placeholder_url');
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // Prevent form submission on Enter
                                    }
                                }}
                            />
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
                        <FormLabel>
                            <FormattedMessage id="cover-image" />
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        field.onChange('placeholder_url');
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // Prevent form submission on Enter
                                    }
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            /> */}
        </div>
    );

    return (
        <Card className="max-w-2xl w-full p-6">
            <Form {...form}>
                <form className="space-y-6">
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
                            <Button type="button" className="ms-auto" onClick={handleNextStep}>
                                <FormattedMessage id="next" />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={() => form.handleSubmit(handleSubmit)()}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <FormattedMessage id="creating" />
                                ) : (
                                    <FormattedMessage id="create-profile" />
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </Card>
    );
};

export default AddProfileForm;