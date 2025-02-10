'use client';

import { Home, Folder, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import Header from '@/components/header';
import SideBar from '@/components/side-bar';
import { Spinner } from '@/components/ui/spinner';
import { AuthLoader } from '@/lib/auth';
import { ROLES, useAuthorization } from '@/lib/authorization';
import type { SideNavigationItem } from '@/types/layout-types';

const Layout = ({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) => {
  const { checkAccess } = useAuthorization();

  const navigation = [
    { name: 'Dashboard', to: '/app', icon: Home },
    { name: 'Discussions', to: '/app/discussions', icon: Folder },
    checkAccess({ allowedRoles: [ROLES.ADMIN] }) && {
      name: 'Users',
      to: '/app/users',
      icon: Users,
    },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <div className="z-50 flex min-h-screen w-full flex-col   bg-muted/40">
      <SideBar navigation={navigation} locale={locale} />
      <div className="flex w-full flex-col sm:gap-4 sm:py-4 sm:ps-60">
        <Header locale={locale} navigation={navigation} />
        <main className="grid  flex-1 items-start gap-4  p-4 sm:px-6 sm:py-0 md:gap-8 ">
          {children}
        </main>
      </div>
    </div>
  );
};

export const DashboardLayout = ({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  return (
    <Layout locale={locale}>
      <Suspense
        fallback={
          <div className="flex size-full items-center justify-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <ErrorBoundary
          key={pathname}
          fallback={<div>Something went wrong!</div>}
        >
          <AuthLoader
            renderLoading={() => (
              <div className="flex size-full items-center justify-center">
                <Spinner size="xl" />
              </div>
            )}
          >
            {children}
          </AuthLoader>
        </ErrorBoundary>
      </Suspense>
    </Layout>
  );
};
