'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SpinetLogo from '@/components/icons/spinet-logo';
import { useLoginViewModel } from '@/lib/viewmodels/auth/login.viewmodel';
import { useLocale } from '@/hooks/use-locale';

export default function LoginForm() {
   const locale = useLocale();
   const [showPassword, setShowPassword] = useState(false);

   const {
      email,
      password,
      fieldErrors,
      isLoading,
      handleEmailChange,
      handlePasswordChange,
      handleEmailBlur,
      handlePasswordBlur,
      handleLogin,
      hasEmailError,
      hasPasswordError,
      canSubmit,
   } = useLoginViewModel();

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleLogin();
   };

   return (
      <div className="space-y-6">
         {/* Header with Logo */}
         <div className="text-center">
            <SpinetLogo className="mx-auto mb-6" width={152} height={32} />
            <p className="text-sm text-muted-foreground">
               Don't have an account?{' '}
               <Link
                  href={`/${locale}/auth/register`}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
               >
                  Sign up
               </Link>
            </p>
         </div>

         {/* Login Form */}
         <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
               <Label htmlFor="email" className="text-foreground">Email</Label>
               <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={handleEmailBlur}
                  className={`transition-colors ${hasEmailError
                     ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                     : 'focus:border-primary focus:ring-primary/20'
                     }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
               />
               {hasEmailError && (
                  <p className="text-sm text-destructive">{fieldErrors.email}</p>
               )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <Link
                     href={`/${locale}/auth/forgot-password`}
                     className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                     Forgot password?
                  </Link>
               </div>
               <div className="relative">
                  <Input
                     id="password"
                     type={showPassword ? 'text' : 'password'}
                     value={password}
                     onChange={(e) => handlePasswordChange(e.target.value)}
                     onBlur={handlePasswordBlur}
                     className={`pr-10 transition-colors ${hasPasswordError
                        ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                        : 'focus:border-primary focus:ring-primary/20'
                        }`}
                     placeholder="Enter your password"
                     disabled={isLoading}
                  />
                  <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                     disabled={isLoading}
                  >
                     {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                     ) : (
                        <Eye className="h-4 w-4" />
                     )}
                  </button>
               </div>
               {hasPasswordError && (
                  <p className="text-sm text-destructive">{fieldErrors.password}</p>
               )}
            </div>

            {/* Login Button */}
            <Button
               type="submit"
               className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
               disabled={!canSubmit || isLoading}
            >
               {isLoading ? (
                  <div className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                     Signing in...
                  </div>
               ) : (
                  'Login'
               )}
            </Button>
         </form>

         {/* Divider */}
         <div className="relative">
            <div className="absolute inset-0 flex items-center">
               <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
               <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
               </span>
            </div>
         </div>

         {/* Social Login Buttons */}
         <div className="space-y-3">
            <Button
               variant="outline"
               className="w-full border-border hover:bg-muted transition-colors"
               onClick={() => console.log('Google login clicked')}
               disabled={isLoading}
            >
               <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
               </svg>
               Login with Google
            </Button>

            <Button
               variant="outline"
               className="w-full border-border hover:bg-muted transition-colors"
               onClick={() => console.log('Apple login clicked')}
               disabled={isLoading}
            >
               <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
               </svg>
               Login with Apple
            </Button>

            <Button
               variant="outline"
               className="w-full border-border hover:bg-muted transition-colors"
               onClick={() => console.log('Facebook login clicked')}
               disabled={isLoading}
            >
               <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
               </svg>
               Login with Facebook
            </Button>

            <Button
               variant="outline"
               className="w-full border-border hover:bg-muted transition-colors"
               onClick={() => console.log('SSO login clicked')}
               disabled={isLoading}
            >
               Login with SSO
            </Button>
         </div>
      </div>
   );
}
