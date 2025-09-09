'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { PanelLeft } from 'lucide-react';
import Logo from '@/components/logo';
import LogoSpinet from '@/components/logo-spinet';
import { SideNavigationItem } from '@/types/layout-types';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription } from '@/components/ui/drawer/drawer';
import { useTheme } from 'next-themes';
import { FormattedMessage } from 'react-intl';
import { useAuth } from '@/context/authContext';
 import { ProfileData } from '@/types/profile';
import { useProfileActions } from '@/context/profileContext';

type Props = {
  navigation: SideNavigationItem[];
  locale: string;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
};

function SideBar({ navigation, locale, isExpanded, setIsExpanded }: Props) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(theme === 'dark');
  const profileId = useAuth().user?.selectedProfile;
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const {getProfileData} = useProfileActions()

  useEffect(() => {
    setIsDark(theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (!profileId) return;

    const fetchProfile = async () => {
      try {
        const data = await getProfileData(profileId);
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfile();
  }, [profileId]);

  return (
    <>
      <aside
        className={cn(
          'hidden lg:flex h-full flex-col bg-background fixed top-0 start-0 transition-all duration-800 ease-in-out overflow-x-hidden ',
          isExpanded ? 'w-60' : 'w-16'
        )}
      >
        <div className="flex flex-col h-full overflow-auto ">
          <div className={cn(
            'flex flex-col gap-1 shrink-0 items-center justify-center border-b border-l border-gray-300 h-20 overflow-hidden',
            isExpanded ? 'w-full' : 'w-16'
          )}>
            {!isDark ? (
              isExpanded ? <>
                <LogoSpinet locale={locale} parentDarkMode={false} />
                <div className='text-sm text-primary'>{profileData ? profileData.fullName : null}</div>
              </> : <Logo locale={locale} />
            ) : (
              isExpanded ? <>
                <LogoSpinet locale={locale} parentDarkMode={true} />
                <div className='text-sm text-primary'>{profileData ? profileData.fullName : null}</div>
              </> : <Logo locale={locale} />
            )}
          </div>

          <nav className={`flex flex-col ${isExpanded ? "items-center" : "items-start"} gap-4 px-2 py-4 flex-1 overflow-x-hidden border-l border-gray-300`}>
            {navigation.map((item) => {
              const isActive = item.to.endsWith('/app')
                ? pathname === (locale === 'en' ? item.to.replace('/en', '') : item.to)
                : locale === 'en'
                  ? pathname === item.to.replace('/en', '') || pathname.startsWith(item.to.replace('/en', '').replace(/\/$/, '') + '/')
                  : pathname === item.to || pathname.startsWith(item.to.replace(/\/$/, '') + '/');
              return (
                <NextLink
                  key={item.name}
                  href={item.to}
                  className={cn(
                    'text-primary hover:bg-[#F1F5F9] hover:text-blue-500',
                    'group flex items-center rounded-md p-2 ms-1 text-base font-medium ',
                    isExpanded && "w-full",
                    isActive && 'bg-[#F1F5F9] dark:bg-white   dark:text-blue-500'
                  )}
                >
                  <item.icon
                    className={cn(
                      'text-primary group-hover:text-blue-500',
                      `${isExpanded ? "me-4" : "mx-auto"} size-6 shrink-0`,
                      isActive && 'text-blue-500 dark:text-blue-500'
                    )}
                    aria-hidden="true"
                  />
                  {isExpanded && <FormattedMessage id={item.name} defaultMessage={item.name} />}
                </NextLink>
              );
            })}
          </nav>
          <div className='flex items-center gap-2'>
            <Button
              size="icon"
              variant="outline"
              className="ms-3 my-2"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <PanelLeft className="size-5" />
            </Button>
          </div>
        </div>
      </aside>

      <Drawer>
        <DrawerTrigger asChild>
          <Button
            size="icon"
            className="lg:hidden absolute start-4 top-3 z-50 border border-azure bg-gray-50 dark:bg-background"
          >
            <PanelLeft className="size-5 text-primary" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </DrawerTrigger>

        <DrawerContent
          side={locale === 'ar' ? 'right' : 'left'}
          lang={locale}
          className='bg-background w-60 h-full fixed top-0 start-0 p-0 lg:hidden'
        >
          <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
          <DrawerDescription className="sr-only">
            Sidebar navigation menu containing links to various sections of the application.
          </DrawerDescription>

          <aside className="flex h-full flex-col overflow-auto">
            <nav className="flex flex-col items-center gap-4 px-2 pb-4">
              <div className="flex flex-col gap-1 h-20 w-full shrink-0 items-center justify-center border-b border-gray-300">
                {isDark ? <LogoSpinet locale={locale} parentDarkMode={true} /> : <LogoSpinet locale={locale} parentDarkMode={false} />}
                <div className='text-sm text-primary'>{profileData ? profileData.fullName : null}</div>
              </div>
              {navigation.map((item) => {
                const isActive = item.to.endsWith('/app')
                  ? pathname === (locale === 'en' ? item.to.replace('/en', '') : item.to)
                  : locale === 'en'
                    ? pathname === item.to.replace('/en', '') || pathname.startsWith(item.to.replace('/en', '').replace(/\/$/, '') + '/')
                    : pathname === item.to || pathname.startsWith(item.to.replace(/\/$/, '') + '/');
                return (
                  <NextLink
                    key={item.name}
                    href={item.to}
                    className={cn(
                      'text-primary hover:bg-gray-700 hover:text-white',
                      'group flex flex-1 w-full items-center rounded-md p-2 text-base font-medium',
                      isActive && 'bg-blue-200 dark:bg-white text-blue-500 dark:text-blue-500'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'text-primary group-hover:text-primary',
                        `me-4 size-6 shrink-0`,
                        isActive && 'text-blue-500 dark:text-blue-500'
                      )}
                      aria-hidden="true"
                    />
                    <FormattedMessage id={item.name} defaultMessage={item.name} />
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