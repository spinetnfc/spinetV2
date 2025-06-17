'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { PanelLeft } from 'lucide-react';
import Logo from '@/components/logo';
import LogoSpinet from '@/components/logo-spinet';
import { SideNavigationItem } from '@/types/layout-types';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription } from '@/components/ui/drawer/drawer';
import { useTheme } from 'next-themes';
import { FormattedMessage } from 'react-intl';

type Props = {
  navigation: SideNavigationItem[];
  locale: string;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
};

function SideBar({ navigation, locale, isExpanded, setIsExpanded }: Props) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(theme === 'dark');

  // Sync isDark with theme changes
  useEffect(() => {
    setIsDark(theme === 'dark');
  }, [theme]);

  return (
    <>
      {/* desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex h-full flex-col bg-background fixed top-0 start-0 transition-all duration-800 ease-in-out overflow-x-hidden',
          isExpanded ? 'w-60' : 'w-16'
        )}
      >
        <div className="flex flex-col h-full overflow-auto">
          {/* logo */}
          <div className={cn(
            'flex shrink-0 items-center justify-center border-b border-gray-300 h-20 overflow-hidden',
            isExpanded ? 'w-full' : 'w-16'
          )}>
            {!isDark ? (
              isExpanded ? <LogoSpinet locale={locale} parentDarkMode={false} /> : <Logo locale={locale} />
            ) : (
              isExpanded ? <LogoSpinet locale={locale} parentDarkMode={true} /> : <Logo locale={locale} />
            )}
          </div>

          {/* navigation */}
          <nav className={`flex flex-col ${isExpanded ? "items-center" : "items-start"} gap-4 px-2 py-4 flex-1 overflow-x-hidden`}>
            {navigation.map((item) => {
              const isActive =
                item.to === '/app'
                  ? pathname === '/app'
                  : pathname.includes(item.to);
              return (
                <NextLink
                  key={item.name}
                  href={item.to}
                  className={cn(
                    'text-gray-400 hover:bg-gray-700 hover:text-white',
                    'group flex items-center rounded-md p-2 ms-1 text-base font-medium ',
                    isExpanded && "w-full",
                    isActive && 'bg-blue-200 dark:bg-white text-blue-500 dark:text-blue-500'
                  )}
                >
                  <item.icon
                    className={cn(
                      'text-gray-400 group-hover:text-gray-400',
                      `${isExpanded ? "me-4" : "mx-auto"} size-6 shrink-0`,
                      isActive && 'text-blue-500 dark:text-blue-500'
                    )}
                    aria-hidden="true"
                  />
                  {isExpanded && <FormattedMessage id={item.name} defaultMessage={item.name} />}
                </NextLink>
              );
            })}
          </nav>

          <Button
            size="icon"
            variant="outline"
            className="ms-3 my-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <PanelLeft className="size-5" />
          </Button>
        </div>
      </aside>

      {/* mobile drawer */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            size="icon"
            className="lg:hidden absolute  start-4 top-3 z-50  border border-azure bg-gray-50 dark:bg-background"
          >
            <PanelLeft className="size-5  text-primary" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </DrawerTrigger>

        <DrawerContent
          side={locale === 'ar' ? 'right' : 'left'}
          lang={locale}
          className='bg-background w-60 h-full fixed top-0 start-0 p-0 lg:hidden'
        >
          <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
          <DrawerDescription className="sr-only">
            Sidebar navigation menu containing links to various sections of the application.
          </DrawerDescription>

          <aside className="flex h-full flex-col overflow-auto">
            <nav className="flex flex-col items-center gap-4 px-2 pb-4">
              <div className="flex h-20 w-full shrink-0 items-center justify-center border-b border-gray-300">
                {isDark ? <LogoSpinet locale={locale} parentDarkMode={true} /> : <LogoSpinet locale={locale} parentDarkMode={false} />}
              </div>
              {navigation.map((item) => {
                const isActive =
                  item.to === '/app'
                    ? pathname === '/app'
                    : pathname.includes(item.to);
                return (
                  <NextLink
                    key={item.name}
                    href={item.to}
                    className={cn(
                      'text-gray-400 hover:bg-gray-700 hover:text-white',
                      'group flex flex-1 w-full items-center rounded-md p-2 text-base font-medium',
                      isActive && 'bg-blue-200 dark:bg-white text-blue-500 dark:text-blue-500'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'text-gray-400 group-hover:text-gray-400',
                        `me-4 size-6 shrink-0`,
                        isActive && 'text-blue-500 dark:text-blue-500'
                      )}
                      aria-hidden="true"
                    />
                    <FormattedMessage id={item.name} defaultMessage={item.name} />
                  </NextLink>
                );
              })}
            </nav>
          </aside>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideBar;