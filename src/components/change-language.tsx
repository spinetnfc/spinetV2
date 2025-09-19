import { Check } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Link } from '@/components//ui/link';
// import ArabicIcon from '@/components/icons/arabic-icon';
// import EnglishIcon from '@/components/icons/english-icon';
// import FrenchIcon from '@/components/icons/french-icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Button } from '@/components/ui/button';
type Props = {
  locale: string;
};

function ChangeLanguage({ locale }: Props) {
  const pathname = usePathname();

  const newPathName = (pathname: string, locale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(ar|fr|en)/, '');
    return `/${locale}${pathWithoutLocale}`;
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer overflow-hidden rounded-full hover:bg-transparent"
        >
          <span className="sr-only">Open Language Switcher</span>
          {locale === 'en' ? (
            <div className='border border-input text-spinet-text-muted text-sm font-semibold w-10 h-10 rounded-full flex items-center justify-center'>EN</div>
          ) : locale === 'fr' ? (
            <div className='border border-input text-spinet-text-muted text-sm font-semibold w-10 h-10 rounded-full flex items-center justify-center'>FR</div>
          ) : (
            <div className='border border-input text-spinet-text-muted text-xs font-semibold w-10 h-10 rounded-full flex items-center justify-center'>AR</div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className=' border border-border p-0'>
        <Link
          href={newPathName(pathname, 'en')}
          className="flex w-full h-8 px-3 py-2 cursor-pointer flex-row items-center justify-between transition-colors duration-200 hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-spinet-text-muted hover:text-foreground">English</span>
          </div>
          {locale === 'en' && <Check className='text-spinet-primary size-4' />}
        </Link>
        <DropdownMenuSeparator className='mx-0 my-0' />
        <Link
          href={newPathName(pathname, 'fr')}
          className="flex w-full h-8 px-3 py-2 cursor-pointer flex-row items-center justify-between transition-colors duration-200 hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-spinet-text-muted hover:text-foreground">Français</span>
          </div>
          {locale === 'fr' && <Check className='text-spinet-primary size-4' />}
        </Link>
        <DropdownMenuSeparator className='mx-0 my-0' />
        <Link
          href={newPathName(pathname, 'ar')}
          className="flex w-full h-8 px-3 py-2 cursor-pointer flex-row items-center justify-between transition-colors duration-200 hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-spinet-text-muted hover:text-foreground">العربية</span>
          </div>
          {locale === 'ar' && <Check className='text-spinet-primary size-4' />}
        </Link>
      </DropdownMenuContent >
    </DropdownMenu >
  );
}

export default ChangeLanguage;
