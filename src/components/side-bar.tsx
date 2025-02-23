import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import Logo from '@/components/logo';
import { SideNavigationItem } from '@/types/layout-types';
import { cn } from '@/utils/cn';

type Props = {
  navigation: SideNavigationItem[];
  locale: string;
};

function SideBar({ navigation, locale }: Props) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 start-0 z-10 hidden w-60 flex-col bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 py-4">
        <div className="flex h-16 shrink-0 items-center px-4">
          <Logo locale={locale} />
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.to;
          return (
            <NextLink
              key={item.name}
              href={item.to}
              className={cn(
                'text-gray-300 hover:bg-gray-700 hover:text-white',
                'group flex flex-1 w-full items-center rounded-md p-2 text-base font-medium',
                isActive && 'bg-gray-900 text-white',
              )}
            >
              <item.icon
                className={cn(
                  'text-gray-400 group-hover:text-gray-300',
                  'me-4 size-6 shrink-0',
                )}
                aria-hidden="true"
              />
              {item.name}
            </NextLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default SideBar;
