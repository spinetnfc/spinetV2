import { ReactNode } from 'react';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';

export const metadata = {
  title: 'Dashboard - Spinet',
  description: 'Dashboard',
  other: {
    viewport: 'width=device-width, initial-scale=0.8, maximum-scale=3, user-scalable=yes'
  }
};

const AppLayout = async ({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: ReactNode;
}) => {
  const { locale } = await params;
  return <DashboardLayout locale={locale}>{children}</DashboardLayout>;
};

export default AppLayout;
