'use client';
import { LayoutDashboard, Contact, BriefcaseBusiness, Bell, Package, Target, ArrowRightLeft, User, Users, Settings, CircleUserRound } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import SideBar from '@/components/side-bar';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/utils/cn';
import type { SideNavigationItem } from '@/types/layout-types';
// import { userRole } from '@/utils/role';
import Header from '../header';
import { SidebarProvider, useSidebar } from '@/context/sidebarContext';

const Layout = ({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) => {
  const { isExpanded, setIsExpanded } = useSidebar();
  // const role = userRole();

  const navigation = [
    { name: 'home', to: `/app`, icon: LayoutDashboard },
    { name: 'profile', to: `/app/profile`, icon: CircleUserRound },
    { name: 'contacts', to: `/app/contacts`, icon: Contact },
    { name: 'settings', to: `/app/profile/update-info`, icon: Settings },
    // { name: 'opportunities', to: `/app/opportunities`, icon: BriefcaseBusiness },
    // { name: 'notifications', to: `/app/notifications`, icon: Bell },
    // { name: 'offers', to: `/app/offers`, icon: Package },
    // { name: 'leads', to: `/app/leads`, icon: Target },
    // { name: 'redirections', to: `/app/redirections`, icon: ArrowRightLeft },
    // { name: 'users', to: `/app/users`, icon: User },
    // { name: 'groups', to: `/app/groups`, icon: Users },
  ].filter(Boolean) as SideNavigationItem[];


  return (
    <div className="z-50 flex min-h-screen w-full flex-col bg-muted/40">
      <SideBar navigation={navigation} locale={locale} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div
        className={cn(
          "flex w-full flex-col transition-all duration-800 ease-in-out",
          "lg:gap-4",
          isExpanded ? "lg:ps-60" : "lg:ps-16"
        )}
      >
        <main className="grid flex-1 items-start gap-4 md:gap-8 relative">
          {children}
          <div className='absolute top-0 sm:top-2 end-2'>
            <Header locale={locale} />
          </div>
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
    <SidebarProvider>
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
            {children}
          </ErrorBoundary>
        </Suspense>
      </Layout>
    </SidebarProvider>
  );
};