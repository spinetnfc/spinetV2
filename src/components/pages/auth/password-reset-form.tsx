'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SpinetLogo from '@/components/icons/spinet-logo';
import { useResetPasswordViewModel } from '@/lib/viewmodels/auth/reset-password.viewmodel';
import { useClientTranslate } from '@/hooks/use-client-translate';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordResetForm() {
   const { t } = useClientTranslate();

   const {
      password,
      confirmPassword,
      fieldErrors,
      isLoading,
      showPassword,
      showConfirmPassword,
      handlePasswordChange,
      handleConfirmPasswordChange,
      handlePasswordBlur,
      handleConfirmPasswordBlur,
      handleResetPassword,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
      hasPasswordError,
      hasConfirmPasswordError,
      canSubmit,
   } = useResetPasswordViewModel();

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleResetPassword();
   };

   return (
      <div className="space-y-6">
         {/* Header with Logo */}
         <div className="text-center">
            <SpinetLogo className="mx-auto mb-6" width={152} height={32} />
            <h1 className="text-sm text-muted-foreground">
               {t('auth.reset-password.title')}
            </h1>
         </div>

         {/* Reset Password Form */}
         <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Field */}
            <div className="space-y-2">
               <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  {t('auth.reset-password.password')}
               </Label>
               <div className="relative">
                  <Input
                     id="password"
                     type={showPassword ? 'text' : 'password'}
                     value={password}
                     onChange={(e) => handlePasswordChange(e.target.value)}
                     onBlur={handlePasswordBlur}
                     placeholder={t('auth.reset-password.password-placeholder')}
                     className={`pr-10 transition-colors ${hasPasswordError
                           ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                           : 'focus:border-primary focus:ring-primary/20'
                        }`}
                     disabled={isLoading}
                  />
                  <Button
                     type="button"
                     variant="ghost"
                     size="sm"
                     className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                     onClick={togglePasswordVisibility}
                     disabled={isLoading}
                  >
                     {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                     ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                     )}
                  </Button>
               </div>
               <p className="text-xs text-muted-foreground">
                  {t('auth.reset-password.password-hint')}
               </p>
               {hasPasswordError && (
                  <p className="text-sm text-destructive">{fieldErrors.password}</p>
               )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
               <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  {t('auth.reset-password.confirm-password')}
               </Label>
               <div className="relative">
                  <Input
                     id="confirmPassword"
                     type={showConfirmPassword ? 'text' : 'password'}
                     value={confirmPassword}
                     onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                     onBlur={handleConfirmPasswordBlur}
                     placeholder={t('auth.reset-password.confirm-password-placeholder')}
                     className={`pr-10 transition-colors ${hasConfirmPasswordError
                           ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                           : 'focus:border-primary focus:ring-primary/20'
                        }`}
                     disabled={isLoading}
                  />
                  <Button
                     type="button"
                     variant="ghost"
                     size="sm"
                     className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                     onClick={toggleConfirmPasswordVisibility}
                     disabled={isLoading}
                  >
                     {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                     ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                     )}
                  </Button>
               </div>
               <p className="text-xs text-muted-foreground">
                  {t('auth.reset-password.confirm-hint')}
               </p>
               {hasConfirmPasswordError && (
                  <p className="text-sm text-destructive">{fieldErrors.confirmPassword}</p>
               )}
            </div>

            {/* Reset Password Button */}
            <Button
               type="submit"
               className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
               disabled={!canSubmit || isLoading}
            >
               {isLoading ? (
                  <div className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                     {t('auth.reset-password.resetting')}
                  </div>
               ) : (
                  t('auth.reset-password.reset-button')
               )}
            </Button>
         </form>
      </div>
   );
}
