'use client';

import { Button } from '@/components/ui/button';
import SpinetLogo from '@/components/icons/spinet-logo';
import { useClientTranslate } from '@/hooks/use-client-translate';
import Link from 'next/link';

export default function NotFoundPage() {
   const { t } = useClientTranslate();

   return (
      <div className="min-h-screen flex items-center justify-center bg-background">
         <div className="max-w-md w-full space-y-8 p-6">
            {/* Header with Logo */}
            <div className="text-center">
               <SpinetLogo className="mx-auto mb-6" width={152} height={32} />
            </div>

            {/* Error Content */}
            <div className="text-center space-y-4">
               {/* Error Code */}
               <h1 className="text-6xl font-bold text-primary">
                  {t('not-found.error-code')}
               </h1>

               {/* Title */}
               <h2 className="text-2xl font-semibold text-foreground">
                  {t('not-found.title')}
               </h2>

               {/* Subtitle */}
               <p className="text-muted-foreground px-4">
                  {t('not-found.subtitle')}
               </p>
            </div>

            {/* Back to Home Button */}
            <div className="pt-4">
               <Link href="/" className="block">
                  <Button
                     className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                     size="lg"
                  >
                     {t('not-found.back-home')}
                  </Button>
               </Link>
            </div>
         </div>
      </div>
   );
}
