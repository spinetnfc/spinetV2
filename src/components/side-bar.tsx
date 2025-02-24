'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { PanelLeft } from 'lucide-react';

import Logo from '@/components/logo-spinet';
import { SideNavigationItem } from '@/types/layout-types';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';

type Props = {
  navigation: SideNavigationItem[];
  locale: string;
};

function SideBar({ navigation, locale }: Props) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Desktop Sidebar - Always visible */}
      <aside
        className={cn(
          'hidden sm:flex h-full flex-col bg-background fixed top-0 transition-all duration-300 ease-in-out',
          locale === 'ar' ? 'right-0' : 'left-0',
          isExpanded ? 'w-60' : 'w-16'
        )}
      >
        <div className="flex flex-col h-full overflow-auto">
          {/* Logo */}
          <div className={cn(
            'flex shrink-0 items-center justify-center border-b border-gray-300 h-20',
            isExpanded ? 'w-full' : 'w-16'
          )}>
            <Logo locale={locale} />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col items-center gap-4 px-2 py-4 flex-1">
            {navigation.map((item) => {
              const isActive = pathname.endsWith(item.to);
              return (
                <NextLink
                  key={item.name}
                  href={item.to}
                  className={cn(
                    'text-gray-400 hover:bg-gray-700 hover:text-white',
                    'group flex items-center rounded-md p-2 text-base font-medium w-full',
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
                  {isExpanded && item.name}
                </NextLink>
              );
            })}
          </nav>

          {/* Expand/Collapse Button */}
          <Button
            size="icon"
            variant="outline"
            className={`m-2 ${isExpanded ? '' : 'mx-auto'}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <PanelLeft className="size-5" />
          </Button>
        </div>
      </aside>

      {/* Mobile Drawer - Only visible on mobile */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="sm:hidden fixed start-4 top-3 z-40"
          >
            <PanelLeft className="size-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </DrawerTrigger>

        <DrawerContent
          side={locale === 'ar' ? 'right' : 'left'}
          lang={locale}
          className={cn(
            'bg-background w-60 h-full fixed top-0 p-0 sm:hidden',
            locale === 'ar' ? 'right-0' : 'left-0'
          )}
        >
          <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
          <DrawerDescription className="sr-only">
            Sidebar navigation menu containing links to various sections of the application.
          </DrawerDescription>

          <aside className="flex h-full flex-col overflow-auto">
            <nav className="flex flex-col items-center gap-4 px-2 pb-4">
              <div className="flex h-20 w-full shrink-0 items-center justify-center border-b border-gray-300">
                <Logo locale={locale} />
              </div>
              {navigation.map((item) => {
                const isActive = pathname.endsWith(item.to);
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
                    {item.name}
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