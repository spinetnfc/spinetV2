'use client';

import { usePathname } from 'next/navigation';
import { LogIn, ShoppingCart } from 'lucide-react';
import ChangeLanguage from '@/components/change-language';
import ThemeSwitch from '@/components/theme-switch';
import Link from 'next/link';
import CtaButton from './pages/landing-page/cta-button';
import UserMenu from './userMenu';

function Header({ locale }: { locale: string }) {
  const isLogged = true;
  const path = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-end gap-4 px-4 sm:static sm:h-auto sm:bg-transparent xl:px-6">
      <div className="flex items-center gap-4">
        <ThemeSwitch locale={locale} />
        <ChangeLanguage locale={locale} />
        {path?.includes("/shop") && <Link href={`/${locale}/shop/cart`}>
          <ShoppingCart className="size-6 text-white" />
        </Link>}
        <UserMenu locale={locale} />

      </div>
    </header>
  );
}

export default Header;