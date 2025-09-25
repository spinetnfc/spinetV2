'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useOnboardingViewModel } from '@/lib/viewmodels/onboarding/onboarding.viewmodel';
import { useClientTranslate } from '@/hooks/use-client-translate';
import { Link as LinkIcon, Phone, Mail, Instagram, MessageCircle, Youtube, Linkedin, Camera, Music, Video, Globe } from 'lucide-react';

// Platform configurations with icons, validation, and dynamic placeholders
const platformConfig = {
   facebook: {
      name: 'Facebook',
      icon: (className: string) => (
         <div className={`${className} bg-blue-600 text-white rounded-lg flex items-center justify-center`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
               <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
         </div>
      ),
      placeholder: 'Username or URL',
      validate: (v: string) => '', // No validation
   },
   phone: {
      name: 'Phone',
      icon: (className: string) => (
         <div className={`${className} bg-green-500 text-white rounded-lg flex items-center justify-center`}>
            <Phone className="w-4 h-4" />
         </div>
      ),
      placeholder: 'Enter phone number',
      validate: (v: string) => v && !/^\+?\d{6,15}$/.test(v.trim()) ? 'Invalid phone number' : '',
   },
   gmail: {
      name: 'Gmail',
      icon: (className: string) => (
         <div className={`${className} bg-red-500 text-white rounded-lg flex items-center justify-center`}>
            <Mail className="w-4 h-4" />
         </div>
      ),
      placeholder: 'email@gmail.com',
      validate: (v: string) => v && !/^([a-zA-Z0-9_.+-]+)@gmail\.com$/.test(v.trim()) ? 'Invalid Gmail address' : '',
   },
   instagram: {
      name: 'Instagram',
      icon: (className: string) => (
         <div className={`${className} bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center`}>
            <Instagram className="w-4 h-4" />
         </div>
      ),
      placeholder: 'Username or URL',
      validate: (v: string) => '', // No validation
   },
   whatsapp: {
      name: 'WhatsApp',
      icon: (className: string) => (
         <div className={`${className} bg-green-500 text-white rounded-lg flex items-center justify-center`}>
            <MessageCircle className="w-4 h-4" />
         </div>
      ),
      placeholder: 'Enter WhatsApp number',
      validate: (v: string) => v && !/^\+?\d{6,15}$/.test(v.trim()) ? 'Invalid WhatsApp number' : '',
   },
   youtube: {
      name: 'YouTube',
      icon: (className: string) => (
         <div className={`${className} bg-red-600 text-white rounded-lg flex items-center justify-center`}>
            <Youtube className="w-4 h-4" />
         </div>
      ),
      placeholder: 'YouTube channel URL',
      validate: (v: string) => v && !/^https?:\/\//.test(v.trim()) ? 'Invalid URL' : '',
   },
   linkedin: {
      name: 'LinkedIn',
      icon: (className: string) => (
         <div className={`${className} bg-blue-700 text-white rounded-lg flex items-center justify-center`}>
            <Linkedin className="w-4 h-4" />
         </div>
      ),
      placeholder: 'LinkedIn profile URL',
      validate: (v: string) => v && !/^https?:\/\//.test(v.trim()) ? 'Invalid URL' : '',
   },
   pinterest: {
      name: 'Pinterest',
      icon: (className: string) => (
         <div className={`${className} bg-red-600 text-white rounded-lg flex items-center justify-center`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm0 19c-.721 0-1.418-.109-2.073-.312.286-.465.713-1.227.87-1.835l.437-1.664c.229.436.895.810 1.604.810 2.111 0 3.633-1.941 3.633-4.354 0-2.312-1.888-4.042-4.316-4.042-3.021 0-4.625 2.003-4.625 4.137 0 .946.368 2.088 1.162 2.458.131.061.201.034.232-.092.025-.1.08-.32.105-.414.033-.123.021-.166-.076-.274-.209-.235-.375-.664-.375-1.075 0-1.386.967-2.681 2.613-2.681 1.415 0 2.4.97 2.4 2.338 0 1.549-.623 2.633-1.33 2.633-.423 0-.738-.359-.637-.804.12-.529.354-1.1.354-1.484 0-.342-.188-.629-.576-.629-.457 0-.824.484-.824 1.132 0 .414.14.695.14.695s-.477 2.06-.564 2.428c-.123.523-.092 1.235-.048 1.696z" />
            </svg>
         </div>
      ),
      placeholder: 'Pinterest profile URL',
      validate: (v: string) => v && !/^https?:\/\//.test(v.trim()) ? 'Invalid URL' : '',
   },
   spotify: {
      name: 'Spotify',
      icon: (className: string) => (
         <div className={`${className} bg-green-500 text-white rounded-lg flex items-center justify-center`}>
            <Music className="w-4 h-4" />
         </div>
      ),
      placeholder: 'Spotify profile URL',
      validate: (v: string) => v && !/^https?:\/\//.test(v.trim()) ? 'Invalid URL' : '',
   },
   tiktok: {
      name: 'TikTok',
      icon: (className: string) => (
         <div className={`${className} bg-black text-white rounded-lg flex items-center justify-center`}>
            <Video className="w-4 h-4" />
         </div>
      ),
      placeholder: 'TikTok username',
      validate: (v: string) => v && /[^a-zA-Z0-9_.]/.test(v.trim()) ? 'Invalid username' : '',
   },
   snapchat: {
      name: 'Snapchat',
      icon: (className: string) => (
         <div className={`${className} bg-yellow-400 text-black rounded-lg flex items-center justify-center`}>
            <Camera className="w-4 h-4" />
         </div>
      ),
      placeholder: 'Snapchat username',
      validate: (v: string) => v && /[^a-zA-Z0-9_.]/.test(v.trim()) ? 'Invalid username' : '',
   },
   website: {
      name: 'Website',
      icon: (className: string) => (
         <div className={`${className} bg-gray-600 text-white rounded-lg flex items-center justify-center`}>
            <Globe className="w-4 h-4" />
         </div>
      ),
      placeholder: 'Website URL',
      validate: (v: string) => v && !/^https?:\/\//.test(v.trim()) ? 'Invalid URL' : '',
   },
};





// Helper to check if a value is non-empty
const isNonEmpty = (v: string | undefined) => v && v.trim() !== '';

export default function Step2Links() {
   const { t } = useClientTranslate();
   const { linkValues, updateLink, removeLinkByPlatform, errors } = useOnboardingViewModel();
   const [isModalOpen, setIsModalOpen] = useState(false);
   // Local state for modal link values
   const [modalLinkValues, setModalLinkValues] = useState<Record<string, string>>({});

   // All platforms
   const allPlatforms = [
      'facebook', 'phone', 'gmail', 'instagram', 'whatsapp', 'youtube', 'linkedin', 'pinterest', 'spotify', 'tiktok', 'snapchat', 'website'
   ];

   // Main area platforms: always show facebook, phone, gmail, plus any others with values
   const defaultMain = ['facebook', 'phone', 'gmail'];
   const mainAreaPlatforms = [
      ...defaultMain,
      ...allPlatforms.filter(
         p => !defaultMain.includes(p) && linkValues[p] && linkValues[p].trim()
      )
   ];
   const modalPlatforms = allPlatforms.filter(p => !mainAreaPlatforms.includes(p));

   // --- Validation: block continue if any visible input has error ---
   // Check all main area platforms for errors
   const hasLinkValidationError = mainAreaPlatforms.some((platform) => {
      const value = linkValues[platform] || '';
      const config = platformConfig[platform as keyof typeof platformConfig];
      if (!config) return false;
      // Only validate if field is non-empty
      return isNonEmpty(value) && !!config.validate(value);
   });

   // Expose to parent/layout via window (quick hack, ideally use context or viewmodel)
   if (typeof window !== 'undefined') {
      (window as any).__onboardingStep2HasError = hasLinkValidationError;
   }

   // On every input change, call updateLink from viewmodel (main area)
   const handleLinkChange = (platform: string, value: string) => {
      updateLink(platform, value);
   };

   // Modal input change: update local state only
   const handleModalLinkChange = (platform: string, value: string) => {
      setModalLinkValues((prev) => ({ ...prev, [platform]: value }));
   };


   // Check for validation errors in modal inputs
   const hasModalValidationError = Object.entries(modalLinkValues).some(([platform, value]) => {
      const config = platformConfig[platform as keyof typeof platformConfig];
      if (!config) return false;
      return isNonEmpty(value) && !!config.validate(value);
   });

   const handleAddSelectedLinks = () => {
      // Persist all non-empty modal link values to store
      Object.entries(modalLinkValues).forEach(([platform, value]) => {
         if (value && value.trim()) {
            updateLink(platform, value);
         }
      });
      // Clear modal state and close
      setModalLinkValues({});
      setIsModalOpen(false);
   };

   // Move a platform from main area back to modal
   const handleMoveToModal = (platform: string) => {
      removeLinkByPlatform(platform);
   };

   // Add prop to control input handler (main vs modal)
   const renderLinkRow = (platformKey: string, value: string = '', showRemove: boolean = false, onRemove?: () => void, index?: number, isModal?: boolean) => {
      const config = platformConfig[platformKey as keyof typeof platformConfig];
      if (!config) return null;
      // Real-time validation
      const error = config.validate(value);
      // Find error for this link (if any from backend/errors)
      let linkError = error;
      if (!linkError && errors && errors[`links.${index}.url`]) {
         linkError = errors[`links.${index}.url`];
      } else if (!linkError && errors && errors[`links.${index}.platform`]) {
         linkError = errors[`links.${index}.platform`];
      }
      return (
         <div key={platformKey} className="flex flex-col gap-1">
            <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
               {config.icon('w-8 h-8')}
               <Input
                  value={value}
                  onChange={(e) =>
                     isModal
                        ? handleModalLinkChange(platformKey, e.target.value)
                        : handleLinkChange(platformKey, e.target.value)
                  }
                  placeholder={config.placeholder}
                  className={`flex-1 border-none bg-transparent focus-visible:ring-0 shadow-none ${linkError ? 'border-destructive ring-destructive' : ''}`}
               />
               {showRemove && (
                  <Button
                     size="sm"
                     variant="ghost"
                     onClick={onRemove}
                     className="text-muted-foreground hover:text-destructive p-1 h-6 w-6"
                  >
                     ×
                  </Button>
               )}
            </div>
            {linkError && (
               <p className="text-xs text-destructive ml-12">{linkError}</p>
            )}
         </div>
      );
   };

   return (
      <div className="space-y-6">
         {/* Main Link Inputs */}
         <div className="space-y-4">
            {mainAreaPlatforms.map((platform, idx) =>
               renderLinkRow(
                  platform,
                  linkValues[platform] || '',
                  true, // Always show remove button
                  () => handleMoveToModal(platform),
                  idx
               )
            )}
         </div>

         {/* More Links Button */}
         <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open);
            if (open) {
               // When opening modal, initialize modalLinkValues with current values for modal platforms
               const initial: Record<string, string> = {};
               modalPlatforms.forEach((platform) => {
                  initial[platform] = linkValues[platform] || '';
               });
               setModalLinkValues(initial);
            }
         }}>
            <DialogTrigger asChild>
               <Button className="w-full py-6 bg-white text-spinet-text-muted hover:bg-slate-100 transition-all duration-200 border border-slate-200">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  More links
               </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md h-[600px] flex flex-col">
               <DialogHeader className="flex-shrink-0">
                  <DialogTitle>Recommended</DialogTitle>
               </DialogHeader>
               <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  <div className="space-y-3">
                     {modalPlatforms.slice(0, 5).map((platform, idx) =>
                        renderLinkRow(
                           platform,
                           modalLinkValues[platform] || '',
                           false,
                           undefined,
                           idx + mainAreaPlatforms.length,
                           true // isModal
                        )
                     )}
                  </div>

                  <div>
                     <h4 className="text-sm font-medium mb-3">Social media</h4>
                     <div className="space-y-3">
                        {modalPlatforms.slice(5).map((platform, idx) =>
                           renderLinkRow(
                              platform,
                              modalLinkValues[platform] || '',
                              false,
                              undefined,
                              idx + mainAreaPlatforms.length + 5,
                              true // isModal
                           )
                        )}
                     </div>
                  </div>
               </div>
               <div className="flex-shrink-0 pt-4 border-t">
                  <Button onClick={handleAddSelectedLinks} className="w-full" disabled={hasModalValidationError}>
                     Add selected links
                  </Button>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
}
