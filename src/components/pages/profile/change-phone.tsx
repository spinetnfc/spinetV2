"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import * as z from 'zod';
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
import { toast } from 'sonner';
import { User } from '@/types/user';
import Cookies from 'js-cookie';
import { Spinner } from '@/components/ui/spinner';

const phoneSchema = z.object({
    phone: z
        .string()
        .min(10, { message: 'phone-number-required' })
        .regex(/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, {
            message: 'invalid-phone-number',
        }),
});

export default function ChangePhoneForm({ user, onCancel }: { user: User, onCancel: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const intl = useIntl();

    const phoneForm = useForm<z.infer<typeof phoneSchema>>({
        resolver: zodResolver(phoneSchema),
        defaultValues: { phone: user.phoneNumber || '' },
    });

    const onPhoneSubmit = async (data: z.infer<typeof phoneSchema>) => {
        try {
            setIsSubmitting(true);
            // Mock update - replace with hardcoded behavior
            console.log("Mock phone update:", data.phone);

            // Update current-user cookie with new phone
            const currentUser = Cookies.get('current-user');
            if (currentUser) {
                try {
                    const userData = JSON.parse(currentUser);
                    userData.phoneNumber = data.phone;
                    Cookies.set('current-user', JSON.stringify(userData), { expires: 7 });
                } catch (error) {
                    console.error('Error updating current-user cookie:', error);
                }
            }

            toast.success(intl.formatMessage({ id: "phone-changed-successfully", defaultMessage: "Phone number changed successfully" }));
            phoneForm.reset({ phone: data.phone });
            onCancel();
        } catch (error: any) {
            toast.error(intl.formatMessage({ id: "failed-to-update-phone", defaultMessage: "Failed to update phone number" }));
            console.error('Phone update error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                    <FormField
                        control={phoneForm.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <FormattedMessage id="new-phone-number" defaultMessage="New Phone Number" />
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="tel"
                                        placeholder={user.phoneNumber || '+1234567890'}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex justify-end gap-2'>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            <FormattedMessage id="cancel" defaultMessage="Cancel" />
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            <FormattedMessage id="save" defaultMessage="Save" />
                            {isSubmitting && (
                                <Spinner className='text-white' />
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}