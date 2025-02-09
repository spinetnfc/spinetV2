import { PanelLeft, PanelRight, User2 } from 'lucide-react';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import Logo from '@/components//logo';
import ChangeLanguage from '@/components/change-language';
import ThemeSwitch from '@/components/theme-switch';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { useLogout } from '@/lib/auth';
import type { SideNavigationItem } from '@/types/layout-tyes';
import { cn } from '@/utils/cn';

function Header({
  locale,
  navigation,
}: {
  locale: string;
  navigation: SideNavigationItem[];
}) {
  const pathname = usePathname();
  const logout = useLogout();
  const router = useRouter();

  return (
    <header className="sticky top-0  z-30  flex h-14 w-full items-center justify-between gap-4   bg-background px-4 sm:static sm:h-auto sm:justify-end sm:border-0 sm:bg-transparent sm:px-6">
      {/* <Progress /> */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            {locale === 'ar' ? (
              <PanelRight className="size-5" />
            ) : (
              <PanelLeft className="size-5" />
            )}
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent
          side={locale === 'ar' ? 'right' : 'left'} // Make side dynamic
          lang={locale}
          className={cn(
            'bg-black pt-10 text-white sm:max-w-60',
            locale === 'ar' ? 'right-0' : 'left-0',
          )}
        >
          <nav className="grid gap-6 text-lg font-medium">
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
        </DrawerContent>
      </Drawer>
      <ThemeSwitch />
      <ChangeLanguage locale={locale} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <span className="sr-only">Open user menu</span>
            <User2 className="size-6 rounded-full" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => router.push('/app/profile')}
            className={cn('block px-4 py-2 text-sm text-primary')}
          >
            Your Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn('block px-4 py-2 text-sm text-primary w-full')}
            onClick={() => logout.mutate({})}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default Header;
