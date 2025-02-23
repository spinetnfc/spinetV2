'use client';

import { useRouter } from 'next/navigation';
import { User2 } from 'lucide-react';

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
import { cn } from '@/utils/cn';

function Header({ locale }: { locale: string }) {
  const router = useRouter();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-end gap-4 px-4 sm:static sm:h-auto sm:bg-transparent sm:px-6">
      <div className="flex items-center gap-4">
        <ThemeSwitch locale={locale} />
        <ChangeLanguage locale={locale} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <User2 className="size-6" />
              <span className="sr-only">Open user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push('/app/profile')} className="text-primary">
              Your Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout.mutate({})} className="text-primary">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;