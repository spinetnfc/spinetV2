import { ReactNode } from 'react';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';

export const metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
};

const AppLayout = ({
  params,
  children,
}: {
  params: { locale: string };
  children: ReactNode;
}) => {
  const { locale } = params;
  return <DashboardLayout locale={locale}>{children}</DashboardLayout>;
};

export default AppLayout;
