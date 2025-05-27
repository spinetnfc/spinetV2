import { AuthLayout } from '@/components/layouts/auth-layout';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Authentification',
  description: 'Authentification for Spinet NFC application',
};

export default async function Layout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
