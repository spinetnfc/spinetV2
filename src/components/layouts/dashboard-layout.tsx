'use client';
import { LayoutDashboard, Contact, BriefcaseBusiness, Bell, Package, Target, ArrowRightLeft, User, Users, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Header from '@/components/header';
import SideBar from '@/components/side-bar';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/utils/cn';
import { AuthLoader } from '@/lib/auth';
import type { SideNavigationItem } from '@/types/layout-types';

const Layout = ({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // Changed back to false for default collapsed state
  const navigation = [
    { name: 'Dashboard', to: `/app`, icon: LayoutDashboard },
    { name: 'Contacts', to: `/app/contacts`, icon: Contact },
    { name: 'Opportunities', to: `/app/opportunities`, icon: BriefcaseBusiness },
    { name: 'Notifications', to: `/app/notifications`, icon: Bell },
    { name: 'Offers', to: `/app/offers`, icon: Package },
    { name: 'Leads', to: `/app/leads`, icon: Target },
    { name: 'Redirections', to: `/app/redirections`, icon: ArrowRightLeft },
    {
      name: 'Users',
      to: `/app/users`,
      icon: User,
    },
    { name: 'Groups', to: `/app/groups`, icon: Users },
    { name: 'Settings', to: `/app/settings`, icon: Settings },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <div className="z-50 flex min-h-screen w-full flex-col bg-muted/40">
      <SideBar navigation={navigation} locale={locale} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div
        className={cn(
          "flex w-full flex-col transition-all duration-800 ease-in-out",
          "sm:gap-4 sm:py-4",
          isExpanded ? "sm:ps-60" : "sm:ps-16"
        )}
      >
        <Header locale={locale} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
          {children}
        </ErrorBoundary>
      </Suspense>
    </Layout>
  );
};