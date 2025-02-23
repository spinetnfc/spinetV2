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
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={cn(
            'fixed start-4 top-3 z-40 sm:start-6 sm:top-6',
            open && 'hidden'
          )}
        >
          <PanelLeft className="size-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </DrawerTrigger>

      <DrawerContent
        side={locale === 'ar' ? 'right' : 'left'}
        lang={locale}
        className={cn(
          'bg-background w-60 h-full fixed top-0 p-0', // Kept p-0 to remove padding
          locale === 'ar' ? 'right-0' : 'left-0'
        )}
      >
        {/* Accessibility: Title and Description */}
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
              const isActive = pathname.endsWith(item.to); // Reverted to original active check
              return (
                <NextLink
                  key={item.name}
                  href={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'text-gray-400 hover:bg-gray-700 hover:text-white', // Original text styles
                    'group flex flex-1 w-full items-center rounded-md p-2 text-base font-medium', // Original layout
                    isActive && 'bg-blue-200 dark:bg-white text-blue-500 dark:text-blue-500' // Original active styles
                  )}
                >
                  <item.icon
                    className={cn(
                      'text-gray-400 group-hover:text-gray-400', // Original icon styles
                      'me-4 size-6 shrink-0',
                      isActive && 'text-blue-500 dark:text-blue-500' // Original active icon styles
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
  );
}

export default SideBar;