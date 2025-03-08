'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useIntl, FormattedMessage } from 'react-intl';
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
import { Textarea } from '@/components/ui/textarea';

// Zod validation schema
const formSchema = z.object({
  fullName: z.string().min(2, { message: 'fullname-required' }),
  email: z.string().email({ message: 'invalid-email-address' }),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export default function SubmitQuestionForm() {
  const intl = useIntl();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission
    console.log(values);
  }

  return (
    <div className="w-full rounded-[20px] bg-white p-6 shadow-[0_80.6px_105.701px_rgba(51,51,51,0.1)] lg:w-1/2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-black text-[#152656] opacity-60 ">
                  <FormattedMessage id="full-name" /> *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-[5px] border-[1.5px] border-[#152656] text-black opacity-80 focus:opacity-100"
                    placeholder={intl.formatMessage({
                      id: 'enter-your-full-name',
                    })}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-black text-[#152656] opacity-60">
                  <FormattedMessage id="email-address" />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-[5px] border-[1.5px] border-[#152656] text-black opacity-80 focus:opacity-100"
                    placeholder={intl.formatMessage({ id: 'enter-your-email' })}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-black text-[#152656] opacity-60">
                  <FormattedMessage id="phone-number" />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-[5px] border-[1.5px] border-[#152656] text-black opacity-80 focus:opacity-100"
                    placeholder={intl.formatMessage({
                      id: 'enter-your-phone-number',
                    })}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-black text-[#152656] opacity-60">
                  <FormattedMessage id="how-can-we-help" />
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="h-[165px] rounded-[5px] border-[1.5px] border-[#152656] text-[#152656] opacity-80 focus:opacity-100  "
                    placeholder={intl.formatMessage({
                      id: 'describe-your-query',
                    })}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="h-[47px] w-[143px] rounded-[8px] bg-[#145FF2] text-white hover:bg-[#145FF2]/90"
          >
            <FormattedMessage id="send" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
