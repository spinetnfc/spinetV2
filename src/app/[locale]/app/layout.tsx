import { ReactNode } from 'react';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';

export const metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
};

const AppLayout = async ({
  params,
  children,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
  children: ReactNode;
}) => {
  const { locale } = await params;
  return <DashboardLayout locale={locale}>{children}</DashboardLayout>;
};

export default AppLayout;
