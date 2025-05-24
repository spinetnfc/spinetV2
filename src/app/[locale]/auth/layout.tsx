import { getServerSession, getLocaleFromCookies } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { AuthLayout } from '@/components/layouts/auth-layout';
import type { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  // We'll let the client-side AuthLayout handle the forgot-password logic
  // Server-side will only handle initial auth state
  const session = await getServerSession();
  const locale = await getLocaleFromCookies();

  return <AuthLayout>{children}</AuthLayout>;
}
