import { Check } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';

import { Link } from '@/components//ui/link';
import ArabicIcon from '@/components/icons/arabic-icon';
import EnglishIcon from '@/components/icons/english-icon';
import FrenchIcon from '@/components/icons/french-icon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
type Props = {
  locale: string;
};

function ChangeLanguage({ locale }: Props) {
  const pathname = usePathname();

  const newPathName = (pathname: string, locale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(ar|fr)/, ''); // Remove existing locale
    const isCurrentEnglish = !/^\/(ar|fr)/.test(pathname); // Check if it's in English (no locale prefix)

    // If switching to English, return the path without any locale prefix
    if (locale === 'en') {
      return pathWithoutLocale === '' ? '/' : pathWithoutLocale;
    }

    // If currently in English and switching to another locale, add the locale prefix
    if (isCurrentEnglish) {
      return `/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    }

    // If switching between non-English locales, replace the existing one
    return `/${locale}${pathWithoutLocale}`;
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-8 cursor-pointer overflow-hidden rounded-full"
        >
          <span className="sr-only">Open Language Switcher</span>
          {locale === 'en' ? (
            <EnglishIcon />
          ) : locale === 'fr' ? (
            <FrenchIcon />
          ) : (
            <ArabicIcon />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link
          href={newPathName(pathname, 'en')}
          className="flex w-full cursor-pointer flex-row items-center justify-between rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center  gap-3">
            <span className="text-sm font-medium text-primary">English</span>
          </div>
          {locale === 'en' && <Check />}
        </Link>
        <DropdownMenuSeparator />
        <Link
          href={newPathName(pathname, 'fr')}
          className="flex w-full cursor-pointer  flex-row items-center justify-between rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">Français</span>
          </div>
          {locale === 'fr' && <Check />}
        </Link>
        <DropdownMenuSeparator />
        <Link
          href={newPathName(pathname, 'ar')}
          className="flex w-full cursor-pointer flex-row items-center justify-between rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center  gap-3">
            <span className="text-sm font-medium text-primary">العربية</span>
          </div>
          {locale === 'ar' && <Check />}
        </Link>
      </DropdownMenuContent >
    </DropdownMenu >
  );
}

export default ChangeLanguage;
