'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SpinetLogo from '@/components/icons/spinet-logo';
import { useSSOViewModel } from '@/lib/viewmodels/auth/sso.viewmodel';
import { useClientTranslate } from '@/hooks/use-client-translate';

export default function SSOForm() {
   const { t } = useClientTranslate();

   const {
      email,
      fieldErrors,
      isLoading,
      handleEmailChange,
      handleEmailBlur,
      handleSSO,
      hasEmailError,
      canSubmit,
   } = useSSOViewModel();

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSSO();
   };

   return (
      <div className="space-y-6">
         {/* Header with Logo */}
         <div className="text-center">
            <SpinetLogo className="mx-auto mb-6" width={152} height={32} />
            <p className="text-sm text-muted-foreground">
               {t('auth.sso.title')}
            </p>
         </div>

         {/* SSO Form */}
         <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
               <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  {t('auth.sso.email')}
               </Label>
               <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={handleEmailBlur}
                  placeholder={t('auth.sso.email-placeholder')}
                  className={`transition-colors ${hasEmailError
                        ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                        : 'focus:border-primary focus:ring-primary/20'
                     }`}
                  disabled={isLoading}
               />
               {hasEmailError && (
                  <p className="text-sm text-destructive">{fieldErrors.email}</p>
               )}
            </div>

            {/* Continue Button */}
            <Button
               type="submit"
               className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
               disabled={!canSubmit || isLoading}
            >
               {isLoading ? (
                  <div className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                     Loading...
                  </div>
               ) : (
                  t('auth.sso.continue')
               )}
            </Button>
         </form>
      </div>
   );
}
