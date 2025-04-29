import { ReactNode } from 'react';

import { AuthLayout as AuthLayoutComponent } from '@/components/layouts/auth-layout';

export const metadata = {
  title: 'Authentification',
  description: 'Authentification for Spinet NFC application',
};

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <AuthLayoutComponent>{children}</AuthLayoutComponent>;
};

export default AuthLayout;
