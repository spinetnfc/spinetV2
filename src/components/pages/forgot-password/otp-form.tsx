import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

type Props = {
  email: string;
  setStep: React.Dispatch<
    React.SetStateAction<'email' | 'otp' | 'newPassword'>
  >;
};
const OtpForm = ({ email, setStep }: Props) => {
  // OTP Validation Schema

  const otpSchema = z.object({
    otp: z.string().length(6, { message: 'otp-length' }),
  });
  const [otpAttempts, setOtpAttempts] = useState(0);
  console.log(otpAttempts);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const onSubmit = (data: z.infer<typeof otpSchema>) => {
    // Simulated OTP validation
    const correctOTP = '123456';
    if (data.otp === correctOTP) {
      setStep('newPassword');
    } else {
      setOtpAttempts((prev) => prev + 1);
      form.setError('otp', {
        type: 'manual',
        message: 'wrong-otp',
      });
    }
  };

  const handleResendOTP = () => {
    // Simulate OTP resend logic
    console.log('OTP Resent');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2>
          <FormattedMessage id="enter-otp" /> {email}
        </h2>
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    {[...Array(6)].map((_, index) => (
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
          className="w-full bg-[#145FF2] text-white hover:bg-blue-700"
        >
          <FormattedMessage id="verify" />
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
