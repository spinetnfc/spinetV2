import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
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
import { Input } from '@/components/ui/input';

type Props = {
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<
    React.SetStateAction<'email' | 'otp' | 'newPassword'>
  >;
  locale: string;
};
const EmailForm = ({ setEmail, locale, setStep }: Props) => {
  // Email Validation Schema
  const emailSchema = z.object({
    email: z.string().email({ message: 'invalid-email-address' }),
  });
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: z.infer<typeof emailSchema>) => {
    // Simulated backend check
    const existingEmails = ['user@example.com', 'test@example.com'];
    if (existingEmails.includes(data.email)) {
      setEmail(data.email);
      setStep('otp');
    } else {
      form.setError('email', {
        type: 'manual',
        message: 'email-non-existing',
      });
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
        </Button>
        <div className="flex justify-center space-x-1 text-sm">
          <span>
            <FormattedMessage id="go-back-to" />{' '}
          </span>
          <Link
            href={`/${locale}/auth/login`}
            className="text-[#0F62FE] underline"
          >
            <FormattedMessage id="log-in" />
          </Link>
        </div>
      </form>
    </Form>
  );
};
export default EmailForm;
