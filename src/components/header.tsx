'use client';

import { usePathname } from 'next/navigation';
import { LogIn, ShoppingCart } from 'lucide-react';
import ChangeLanguage from '@/components/change-language';
import ThemeSwitch from '@/components/theme-switch';
import Link from 'next/link';
import UserMenu from './userMenu';
import NotificationDropdown from './ui/notifications/notifications-dropdown';

function Header({ locale }: { locale: string }) {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-end gap-4 sm:h-auto sm:bg-transparent">
      <div className="flex items-center gap-4">
        <NotificationDropdown locale={locale} />
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