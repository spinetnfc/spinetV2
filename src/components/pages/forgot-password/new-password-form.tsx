import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
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

type Props = {
  email: string;
};
const NewPasswordForm = ({ email }: Props) => {
  const intl = useIntl();

  const [showPassword, setShowPassword] = useState(false);

  const newPasswordSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: 'password-length' })
        .regex(/[A-Z]/, {
          message: 'password-contains-uppercase-letter',
        })
        .regex(/[a-z]/, {
          message: 'password-contains-lowercase-letter',
        })
        .regex(/[0-9]/, {
          message: 'password-contains-number',
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'passwords-must-match',
      path: ['confirmPassword'],
    });
  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: z.infer<typeof newPasswordSchema>) => {
    console.log(data);
    // Password reset logic would go here
    console.log('Password reset for', email);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-4xl font-semibold">
          <FormattedMessage id="create-new-password" />
        </h1>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage id="new-password" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={intl.formatMessage({
                      id: 'enter-new-password',
                    })}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage id="password-confirmation" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={intl.formatMessage({
                      id: 'confirm-new-password',
                    })}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-[#145FF2] text-white hover:bg-blue-700"
        >
          <FormattedMessage id="save" />
        </Button>
      </form>
    </Form>
  );
};

export default NewPasswordForm;
