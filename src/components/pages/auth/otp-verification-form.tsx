'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SpinetLogo from '@/components/icons/spinet-logo';
import { useOTPVerificationViewModel } from '@/lib/viewmodels/auth/otp-verification.viewmodel';
import { useClientTranslate } from '@/hooks/use-client-translate';
import OtpIcon from '@/assets/images/otp-verification-icon.png';
import Image from "next/image"


export default function OTPVerificationForm() {
   const { t } = useClientTranslate();
   const [currentIndex, setCurrentIndex] = useState(0);
   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

   const {
      code,
      fieldErrors,
      isLoading,
      isResending,
      handleCodeChange,
      handleCodeBlur,
      handleVerifyOTP,
      handleResendCode,
      hasCodeError,
      canSubmit,
   } = useOTPVerificationViewModel();

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleVerifyOTP();
   };

   // Split the code into individual digits for display
   const codeDigits = code.padEnd(6, ' ').split('').slice(0, 6);

   // Handle input change for individual digit inputs
   const handleDigitChange = (index: number, value: string) => {
      const digit = value.replace(/\D/g, '').slice(-1); // Only keep last digit

      const newCode = code.split('');
      newCode[index] = digit;
      const updatedCode = newCode.join('').replace(/\s+$/, ''); // Remove trailing spaces

      handleCodeChange(updatedCode);

      // Move to next input if digit entered and not at last input
      if (digit && index < 5) {
         const nextInput = inputRefs.current[index + 1];
         if (nextInput) {
            nextInput.focus();
            setCurrentIndex(index + 1);
         }
      }
   };

   // Handle key down for navigation
   const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
         const prevInput = inputRefs.current[index - 1];
         if (prevInput) {
            prevInput.focus();
            setCurrentIndex(index - 1);
         }
      } else if (e.key === 'ArrowLeft' && index > 0) {
         const prevInput = inputRefs.current[index - 1];
         if (prevInput) {
            prevInput.focus();
            setCurrentIndex(index - 1);
         }
      } else if (e.key === 'ArrowRight' && index < 5) {
         const nextInput = inputRefs.current[index + 1];
         if (nextInput) {
            nextInput.focus();
            setCurrentIndex(index + 1);
         }
      }
   };

   // Handle paste
   const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
      handleCodeChange(pastedText);

      // Focus the appropriate input after paste
      const targetIndex = Math.min(pastedText.length, 5);
      const targetInput = inputRefs.current[targetIndex];
      if (targetInput) {
         targetInput.focus();
         setCurrentIndex(targetIndex);
      }
   };

   return (
      <div className="space-y-6">
         {/* Header with Logo */}
         <div className="text-center">
            <SpinetLogo className="mx-auto mb-6" width={152} height={32} />

            {/* OTP Verification Icon */}

            <Image src={OtpIcon} alt="OTP Verification" className="mx-auto mb-4" />

            <p className="text-sm text-muted-foreground mb-2">
               {t('auth.otp.subtitle')}
            </p>
            <p className="text-sm text-muted-foreground">
               {t('auth.otp.email-sent-to')}
            </p>
         </div>

         {/* OTP Form */}
         <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Fields */}
            <div className="space-y-2">
               <div className="flex justify-center gap-3">
                  {codeDigits.map((digit, index) => (
                     <Input
                        key={index}
                        ref={(el) => {
                           inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit.trim()}
                        onChange={(e) => handleDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        onFocus={() => setCurrentIndex(index)}
                        onBlur={handleCodeBlur}
                        className={`w-12 h-12 text-center text-lg font-semibold transition-colors ${hasCodeError
                              ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                              : 'focus:border-primary focus:ring-primary/20'
                           }`}
                        disabled={isLoading}
                     />
                  ))}
               </div>
               {hasCodeError && (
                  <p className="text-sm text-destructive text-center">{fieldErrors.code}</p>
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
                     {t('auth.otp.verifying')}
                  </div>
               ) : (
                  t('auth.otp.continue')
               )}
            </Button>
         </form>

         {/* Resend Code */}
         <div className="text-center">
            <Button
               type="button"
               variant="ghost"
               className="text-sm text-muted-foreground hover:text-foreground transition-colors"
               onClick={handleResendCode}
               disabled={isResending || isLoading}
            >
               {isResending ? (
                  <div className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                     {t('auth.otp.resending')}
                  </div>
               ) : (
                  t('auth.otp.send-again')
               )}
            </Button>
         </div>
      </div>
   );
}
