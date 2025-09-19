import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

type Props = {
  email: string;
  sessionId: string;
  setSessionId: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<
    React.SetStateAction<'email' | 'otp' | 'newPassword'>
  >;
};
const OtpForm = ({ email, setStep, sessionId, setSessionId }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const intl = useIntl();
  // OTP Validation Schema
  const otpSchema = z.object({
    otp: z.string().length(5, { message: 'otp-length' }),
  });
  const [otpAttempts, setOtpAttempts] = useState(0);
  console.log(otpAttempts);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const onSubmit = async (data: z.infer<typeof otpSchema>) => {
    try {
      setIsSubmitting(true);

      // Mock OTP verification - accept any 6-digit code
      if (data.otp.length === 6) {
        setSessionId('mock-reset-session-id');
        toast.success(intl.formatMessage({ id: "OTP verified successfully" }),);
        setStep('newPassword');
      } else {
        throw new Error('Invalid OTP');
      }

    } catch (error) {
      toast.error(intl.formatMessage({ id: "Failed to verify OTP, try again" }));
      console.error('Forgot password error:', error);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = () => {
    // Simulate OTP resend logic
    console.log('OTP Resent');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-row justify-center items-center">
        <h2 className='font-semibold text-2xl text-center'>
          <FormattedMessage id="enter-otp" /> {email}
        </h2>
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className='m-auto'>OTP</FormLabel> */}
              <FormControl>
                <InputOTP maxLength={5} {...field} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
                  <InputOTPGroup className='m-auto'>
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
        <Button
          type="submit"
          className="w-full"
        >
          <FormattedMessage id="verify" />
          {isSubmitting && <Spinner className='text-white' />}
        </Button>
        <div className="text-center text-sm">
          <FormattedMessage id="did-not-receive-code" />
          <button
            type="button"
            onClick={handleResendOTP}
            className="ms-1 text-spinet-primary underline"
          >
            <FormattedMessage id="resend-code" />
          </button>
        </div>
      </form>
    </Form>
  );
};

export default OtpForm;
