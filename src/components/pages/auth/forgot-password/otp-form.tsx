import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
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
import { verifyOTP } from '@/lib/api/auth';
import { toast } from 'sonner';

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
      console.log('Current sessionId before verify:', sessionId);
      const response = await verifyOTP(sessionId, data.otp);
      setSessionId(response.resetSessionId);
      toast.success('OTP verified successfully');
      setStep('newPassword');

    } catch (error) {
      toast.error('Failed to verify OTP, try again');
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
          {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
        </Button>
        <div className="text-center text-sm">
          <FormattedMessage id="did-not-receive-code" />
          <button
            type="button"
            onClick={handleResendOTP}
            className="ml-1 text-[#0F62FE] underline"
          >
            <FormattedMessage id="resend-code" />
          </button>
        </div>
      </form>
    </Form>
  );
};

export default OtpForm;
