import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
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
import { useState } from 'react';
import { set } from 'date-fns';
import { Spinner } from '@/components/ui/spinner';
import { useIsAuthenticated } from '@/store/auth-store';

type Props = {
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setSessionId: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<
    React.SetStateAction<'email' | 'otp' | 'newPassword'>
  >;
  locale: string;
};
const EmailForm = ({ setEmail, locale, setStep, setSessionId }: Props) => {
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  // Email Validation Schema
  const emailSchema = z.object({
    email: z.string().email({ message: 'invalid-email-address' }),
  });
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    try {
      setIsSubmitting(true);

      // Mock implementation - just proceed to OTP step
      setEmail(data.email);
      setSessionId('mock-session-id');
      toast.success(intl.formatMessage({ id: "OTP sent to your email" }));
      setStep('otp');

    } catch (error) {
      toast.error(intl.formatMessage({ id: "Failed to send OTP, try again with a valid email" }));
      console.error('Forgot password error:', error);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage id="email-address" />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="username@gmail.com"
                  {...field}
                  className="border-gray-200 dark:border-blue-950 focus:border-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
        >
          <FormattedMessage id="send-otp" />
          {isSubmitting && <Spinner className="text-white" size="sm" />}
        </Button>
        <div className="flex justify-center space-x-1 text-sm">
          <span>
            <FormattedMessage id="go-back-to" />{' '}
          </span>
          <Link
            href={isAuthenticated ? `/${locale}/app` : `/${locale}/auth/login`}
            className="text-spinet-primary underline"
          >
            {isAuthenticated ? <FormattedMessage id="app" /> : <FormattedMessage id="log-in" />}
          </Link>
        </div>
      </form>
    </Form>
  );
};
export default EmailForm;
