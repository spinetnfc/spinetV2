'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LogIn, ShoppingCart, User2 } from 'lucide-react';

import ChangeLanguage from '@/components/change-language';
import ThemeSwitch from '@/components/theme-switch';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { useLogout } from '@/lib/auth';
import Link from 'next/link';
import CtaButton from './pages/landing-page/cta-button';
function Header({ locale }: { locale: string }) {
  const router = useRouter();
  const logout = useLogout();
  const isLogged = true;
  const path = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-end gap-4 px-4 sm:static sm:h-auto sm:bg-transparent xl:px-6">
      <div className="flex items-center gap-4">
        <ThemeSwitch locale={locale} />
        <ChangeLanguage locale={locale} />
        {!isLogged && <CtaButton
          text="log in"
          // text={intl.formatMessage({ id: "log-in" })}
          icon={<LogIn className="me-2.5 size-6" />}
          link={`/${locale}/auth/login`}
        />}
        {isLogged && <>
          {path?.includes("/shop") && <Link href={`/${locale}/shop/cart`}>
            <ShoppingCart className="size-6 text-white" />
          </Link>}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full bg-white dark:bg-background">
                <User2 className="size-6" />
                <span className="sr-only">Open user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push('/profile')} className="text-primary">
                Your Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout.mutate({})} className="text-primary">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>}

      </div>
    </header>
  );
}

export default Header;