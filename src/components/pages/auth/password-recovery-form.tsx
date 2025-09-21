'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SpinetLogo from '@/components/icons/spinet-logo';
import { useForgotPasswordViewModel } from '@/lib/viewmodels/auth/forgot-password.viewmodel';
import { useClientTranslate } from '@/hooks/use-client-translate';

export default function PasswordRecoveryForm() {
   const { t } = useClientTranslate();

   const {
      email,
      fieldErrors,
      isLoading,
      emailSent,
      handleEmailChange,
      handleEmailBlur,
      handleForgotPassword,
      handleGetNewLink,
      hasEmailError,
      canSubmit,
   } = useForgotPasswordViewModel();

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!emailSent) {
         handleForgotPassword();
      }
   };

   return (
      <div className="space-y-6">
         {/* Header with Logo */}
         <div className="text-center">
            <SpinetLogo className="mx-auto mb-6" width={152} height={32} />
            <p className="text-sm text-muted-foreground px-4">
               {t('auth.forgot-password.title')}
            </p>
         </div>

         {/* Forgot Password Form */}
         <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
               <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  {t('auth.forgot-password.email')}
               </Label>
               <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={handleEmailBlur}
                  placeholder={t('auth.forgot-password.email-placeholder')}
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
               disabled={!canSubmit || isLoading || emailSent}
            >
               {isLoading ? (
                  <div className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                     {t('auth.forgot-password.sending')}
                  </div>
               ) : (
                  t('auth.forgot-password.continue')
               )}
            </Button>
         </form>
      </div>
   );
}
