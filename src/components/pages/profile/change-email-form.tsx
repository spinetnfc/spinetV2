"use client"
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import * as z from 'zod';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
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
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { User } from '@/types/user';
import Cookies from 'js-cookie';
import { Spinner } from '@/components/ui/spinner';

const emailSchema = z.object({
    email: z.string().email({ message: 'invalid-email' }),
});

const otpSchema = z.object({
    otp: z.string().length(5, { message: 'otp-length' }),
});

// Mock functions to replace backend calls
const requestEmailChangeAction = async (userId: string, oldEmail: string, newEmail: string) => {
    console.log("Mock request email change:", { userId, oldEmail, newEmail });
    return {
        success: true,
        data: {
            restSessionId: "mock-session-id-123",
            restSessionID: "mock-session-id-123"
        },
        error: null
    };
};

const verifyEmailChangeOTPAction = async (userId: string, sessionId: string, otp: string) => {
    console.log("Mock verify email change OTP:", { userId, sessionId, otp });
    return {
        success: true,
        data: { message: "Email changed successfully" },
        error: null
    };
};

export default function ChangeEmailForm({ user, onCancel }: { user: User, onCancel: () => void }) {
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [sessionID, setSessionID] = useState<string | null>(null);
    const [newEmail, setNewEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const intl = useIntl();

    const emailForm = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: '' },
    });

    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: '' },
    });

    useEffect(() => {
        console.log('Current sessionID state:', sessionID);
    }, [sessionID]);

    const onEmailSubmit = async (data: z.infer<typeof emailSchema>) => {
        try {
            setIsSubmitting(true);
            console.log('Requesting email change:', { userId: user._id, oldEmail: user.email, newEmail: data.email });
            const response = await requestEmailChangeAction(user._id, user.email, data.email);
            if (!response.success) throw new Error(response.error || "Request failed");
            const receivedSessionID = response.data.restSessionId || response.data.restSessionID;

            if (!receivedSessionID) {
                throw new Error('No sessionID received from API');
            }

            setSessionID(receivedSessionID);
            setNewEmail(data.email);
            setStep('otp');
            toast.success(intl.formatMessage({ id: "OTP sent to new email address" }));
        } catch (error: any) {
            toast.error(intl.formatMessage({ id: "Failed to request email change" }));
            console.error('Email change request error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const onOtpSubmit = async (data: z.infer<typeof otpSchema>) => {
        if (!sessionID) {
            toast.error(intl.formatMessage({ id: "Session ID is missing. Please try again." }));
            setStep('email');
            return;
        }

        try {
            setIsSubmitting(true);
            console.log('Verifying OTP:', { userId: user._id, sessionID, otp: data.otp });
            const response = await verifyEmailChangeOTPAction(user._id, sessionID, data.otp);
            if (!response.success) throw new Error(response.error || "OTP verification failed");
            console.log('OTP verification response:', response);

            // Update current-user cookie with new email
            const currentUser = Cookies.get('current-user');
            if (currentUser) {
                try {
                    const userData = JSON.parse(currentUser);
                    userData.email = newEmail;
                    Cookies.set('current-user', JSON.stringify(userData), { expires: 7 }); // Adjust expiration as needed
                    console.log('Updated current-user cookie:', userData);
                } catch (error) {
                    console.error('Error updating current-user cookie:', error);
                }
            } else {
                console.warn('current-user cookie not found');
            }

            toast.success(intl.formatMessage({ id: "Email changed successfully" }));
            setStep('email');
            setSessionID(null);
            setNewEmail('');
            emailForm.reset();
            otpForm.reset();
        } catch (error: any) {
            toast.error(intl.formatMessage({ id: "Failed to verify OTP" }));
            console.error('OTP verification error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOTP = async () => {
        if (!newEmail) {
            toast.error(intl.formatMessage({ id: "No email address available to resend OTP" }));
            setStep('email');
            return;
        }

        try {
            console.log('Resending OTP:', { userId: user._id, oldEmail: user.email, newEmail });
            const response = await requestEmailChangeAction(user._id, user.email, newEmail);
            if (!response.success) throw new Error(response.error || "Resend request failed");

            const receivedSessionID = response.data.restSessionId || response.data.restSessionID;

            if (!receivedSessionID) {
                throw new Error('No sessionID received from API');
            }

            setSessionID(receivedSessionID);
            toast.success(intl.formatMessage({ id: "OTP resent successfully" }));
        } catch (error: any) {
            toast.error(intl.formatMessage({ id: "Failed to resend OTP" }));
            console.error('OTP resend error:', error);
        }
    };

    return (
        <div className="space-y-4">
            {step === 'email' && (
                <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                        <FormField
                            control={emailForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <FormattedMessage id="new-email-address" defaultMessage="New Email" />
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder={user.email}
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
                                className='hover:bg-transparent'
                                onClick={onCancel}
                            >
                                <FormattedMessage id="cancel" defaultMessage="Cancel" />
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                <FormattedMessage id="send-otp" defaultMessage="Send OTP" />
                                {isSubmitting && (
                                    <Spinner className='text-white' />
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}

            {step === 'otp' && (
                <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                        <h3 className="font-semibold text-xl text-center">
                            <FormattedMessage id="enter-otp" defaultMessage="Enter OTP sent to" /> {newEmail}
                        </h3>
                        <FormField
                            control={otpForm.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <InputOTP
                                            maxLength={5}
                                            {...field}
                                            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                                        >
                                            <InputOTPGroup className="m-auto">
                                                {[...Array(5)].map((_, index) => (
                                                    <InputOTPSlot key={index} index={index} />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>
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
                                <FormattedMessage id="verify" defaultMessage="Verify" />
                                {isSubmitting && (
                                    <Spinner className='text-white' />
                                )}
                            </Button>
                        </div>
                        <div className="text-center text-sm">
                            <FormattedMessage id="did-not-receive-code" defaultMessage="Didn't receive the code?" />
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                className="ms-1 text-[#0F62FE] underline"
                            >
                                <FormattedMessage id="resend-code" defaultMessage="Resend Code" />
                            </button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
}