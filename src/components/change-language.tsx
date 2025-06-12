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
        <button
          // variant="outline"
          // size="icon"
          className="cursor-pointer overflow-hidden rounded-full outline-1"
        >
          <span className="sr-only">Open Language Switcher</span>
          {locale === 'en' ? (
            // <EnglishIcon />
            <div className='bg-red-500 text-white text-sm font-semibold w-8 h-8 rounded-full flex items-center justify-center'>EN</div>
          ) : locale === 'fr' ? (
            // <FrenchIcon />
            <div className='bg-blue-500 text-white text-sm font-semibold w-8 h-8 rounded-full flex items-center justify-center'>FR</div>

          ) : (
            // <ArabicIcon />
            <div className='bg-green-600 text-white text-xs font-semibold w-8 h-8 rounded-full flex items-center justify-center'>AR</div>

          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className='bg-white dark:bg-main p-0'>
        <Link
          href={newPathName(pathname, 'en')}
          className="flex w-full h-8 px-1 cursor-pointer  flex-row items-center justify-between transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-navy"
        >
          <div className="flex items-center  gap-3">
            <span className="text-sm font-medium text-primary">English</span>
          </div>
          {locale === 'en' && <Check className='text-primary' />}
        </Link>
        <DropdownMenuSeparator className='-mx-0 my-0' />
        <Link
          href={newPathName(pathname, 'fr')}
          className="flex w-full h-8 px-1 cursor-pointer  flex-row items-center justify-between transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-navy"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">Français</span>
          </div>
          {locale === 'fr' && <Check className='text-primary' />}
        </Link>
        <DropdownMenuSeparator className='-mx-0 my-0' />
        <Link
          href={newPathName(pathname, 'ar')}
          className="flex w-full h-8 px-1 text-sm cursor-pointer flex-row items-center justify-between transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-navy"
        >
          <div className="flex items-center  gap-3">
            <span className="text-sm font-medium text-primary">العربية</span>
          </div>
          {locale === 'ar' && <Check className='text-primary' />}
        </Link>
      </DropdownMenuContent >
    </DropdownMenu >
  );
}

export default ChangeLanguage;
