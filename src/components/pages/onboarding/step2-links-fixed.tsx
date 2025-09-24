'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useOnboardingViewModel } from '@/lib/viewmodels/onboarding/onboarding.viewmodel';
import { useClientTranslate } from '@/hooks/use-client-translate';
import { Link as LinkIcon, Phone, Mail, Instagram, MessageCircle, Youtube, Linkedin, Camera, Music, Video, Globe } from 'lucide-react';

// Platform configurations with icons and colors
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
      placeholder: '@username'
   },
   phone: {
      name: 'Phone',
      icon: (className: string) => (
         <div className={`${className} bg-green-500 text-white rounded-lg flex items-center justify-center`}>
            <Phone className="w-4 h-4" />
         </div>
      ),
      placeholder: '+213'
   },
   gmail: {
      name: 'Gmail',
      icon: (className: string) => (
         <div className={`${className} bg-red-500 text-white rounded-lg flex items-center justify-center`}>
            <Mail className="w-4 h-4" />
         </div>
      ),
      placeholder: 'email@gmail.com'
   },
   instagram: {
      name: 'Instagram',
      icon: (className: string) => (
         <div className={`${className} bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center`}>
            <Instagram className="w-4 h-4" />
         </div>
      ),
      placeholder: '@username'
   },
   whatsapp: {
      name: 'WhatsApp',
      icon: (className: string) => (
         <div className={`${className} bg-green-500 text-white rounded-lg flex items-center justify-center`}>
            <MessageCircle className="w-4 h-4" />
         </div>
      ),
      placeholder: '+213'
   },
   youtube: {
      name: 'YouTube',
      icon: (className: string) => (
         <div className={`${className} bg-red-600 text-white rounded-lg flex items-center justify-center`}>
            <Youtube className="w-4 h-4" />
         </div>
      ),
      placeholder: 'youtube.com/c/channel'
   },
   linkedin: {
      name: 'LinkedIn',
      icon: (className: string) => (
         <div className={`${className} bg-blue-700 text-white rounded-lg flex items-center justify-center`}>
            <Linkedin className="w-4 h-4" />
         </div>
      ),
      placeholder: 'linkedin.com/in/username'
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
      placeholder: 'pinterest.com/username'
   },
   spotify: {
      name: 'Spotify',
      icon: (className: string) => (
         <div className={`${className} bg-green-500 text-white rounded-lg flex items-center justify-center`}>
            <Music className="w-4 h-4" />
         </div>
      ),
      placeholder: 'open.spotify.com/user/username'
   },
   tiktok: {
      name: 'TikTok',
      icon: (className: string) => (
         <div className={`${className} bg-black text-white rounded-lg flex items-center justify-center`}>
            <Video className="w-4 h-4" />
         </div>
      ),
      placeholder: '@username'
   },
   snapchat: {
      name: 'Snapchat',
      icon: (className: string) => (
         <div className={`${className} bg-yellow-400 text-black rounded-lg flex items-center justify-center`}>
            <Camera className="w-4 h-4" />
         </div>
      ),
      placeholder: '@username'
   },
   website: {
      name: 'Website',
      icon: (className: string) => (
         <div className={`${className} bg-gray-600 text-white rounded-lg flex items-center justify-center`}>
            <Globe className="w-4 h-4" />
         </div>
      ),
      placeholder: 'https://yourwebsite.com'
   }
};

// Global state for Step 2 pending links (accessible from viewmodel)
let pendingLinksForStep2: Record<string, string> = {};

export const getPendingLinksForStep2 = () => pendingLinksForStep2;
export const clearPendingLinksForStep2 = () => {
   pendingLinksForStep2 = {};
};

export default function Step2Links() {
   const { t } = useClientTranslate();
   const { data, errors, validateAndAddLink, removeLink, isValidUrl } = useOnboardingViewModel();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [linkValues, setLinkValues] = useState<Record<string, string>>({});

   // Track which platforms are shown in main area vs modal
   const [mainAreaPlatforms, setMainAreaPlatforms] = useState(['facebook', 'phone', 'gmail']);

   // All other platforms start in modal
   const allModalPlatforms = ['instagram', 'whatsapp', 'youtube', 'linkedin', 'pinterest', 'spotify', 'tiktok', 'snapchat', 'website'];
   const [modalPlatforms, setModalPlatforms] = useState(allModalPlatforms);

   // Initialize link values from existing data on mount and organize platforms
   useEffect(() => {
      const initialValues: Record<string, string> = {};
      const platformsInMainFromData: string[] = [];

      // Load existing links from data into linkValues for editing
      data.links.forEach((link: any) => {
         const platformKey = Object.keys(platformConfig).find(
            key => platformConfig[key as keyof typeof platformConfig].name.toLowerCase() === link.platform.toLowerCase()
         );
         if (platformKey) {
            initialValues[platformKey] = link.url;
            // If this platform is not in default main platforms, add it to main area
            if (!['facebook', 'phone', 'gmail'].includes(platformKey)) {
               platformsInMainFromData.push(platformKey);
            }
         }
      });

      setLinkValues(initialValues);

      // Update platform organization based on existing data
      if (platformsInMainFromData.length > 0) {
         setMainAreaPlatforms(prev => [...prev, ...platformsInMainFromData]);
         setModalPlatforms(prev => prev.filter(platform => !platformsInMainFromData.includes(platform)));
      }
   }, []);

   // Sync linkValues with global pending links (but only values not already saved)
   useEffect(() => {
      const pendingOnly: Record<string, string> = {};
      Object.entries(linkValues).forEach(([platform, value]) => {
         // Only include in pending if not already saved in data.links
         const isAlreadySaved = data.links.some((link: any) => {
            const platformKey = Object.keys(platformConfig).find(
               key => platformConfig[key as keyof typeof platformConfig].name.toLowerCase() === link.platform.toLowerCase()
            );
            return platformKey === platform;
         });

         if (!isAlreadySaved && value.trim()) {
            pendingOnly[platform] = value;
         }
      });

      pendingLinksForStep2 = pendingOnly;
   }, [linkValues, data.links]);

   const handleLinkChange = (platform: string, value: string) => {
      setLinkValues(prev => ({ ...prev, [platform]: value }));
   };

   const handleAddSelectedLinks = async () => {
      // Find platforms from modal that have values
      const selectedLinks = Object.entries(linkValues).filter(([platform, value]) =>
         modalPlatforms.includes(platform) && value.trim()
      );

      // Add these links to the global data
      for (const [platform, url] of selectedLinks) {
         if (url.trim() && isValidUrl(url)) {
            const platformName = platformConfig[platform as keyof typeof platformConfig].name;
            await validateAndAddLink(platformName, url);
         }
      }

      // Move filled platforms from modal to main area
      const platformsToMove = selectedLinks.map(([platform]) => platform);
      setMainAreaPlatforms(prev => [...prev, ...platformsToMove]);
      setModalPlatforms(prev => prev.filter(platform => !platformsToMove.includes(platform)));

      setIsModalOpen(false);
   };

   // Move a platform from main area back to modal
   const handleMoveToModal = (platform: string) => {
      // Remove any existing link for this platform from global data first
      const existingLinkIndex = data.links.findIndex((link: any) => {
         const platformKey = Object.keys(platformConfig).find(
            key => platformConfig[key as keyof typeof platformConfig].name.toLowerCase() === link.platform.toLowerCase()
         );
         return platformKey === platform;
      });

      if (existingLinkIndex !== -1) {
         removeLink(existingLinkIndex);
      }

      // Clear the link value in local state
      setLinkValues(prev => ({ ...prev, [platform]: '' }));

      // Move platform from main to modal (unless it's a default main platform)
      const defaultMainPlatforms = ['facebook', 'phone', 'gmail'];
      if (!defaultMainPlatforms.includes(platform)) {
         setMainAreaPlatforms(prev => prev.filter(p => p !== platform));
         setModalPlatforms(prev => [...prev, platform]);
      }
   };

   const renderLinkRow = (platformKey: string, value: string = '', onChange?: (value: string) => void, showRemove: boolean = false, onRemove?: () => void) => {
      const config = platformConfig[platformKey as keyof typeof platformConfig];
      if (!config) return null;

      return (
         <div key={platformKey} className="flex items-center gap-3 p-3 bg-background border rounded-lg">
            {config.icon('w-8 h-8')}
            <Input
               value={value}
               onChange={(e) => onChange?.(e.target.value)}
               placeholder={config.placeholder}
               className="flex-1 border-none bg-transparent focus-visible:ring-0 shadow-none"
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
      );
   };

   return (
      <div className="space-y-6">
         {/* Main Link Inputs */}
         <div className="space-y-4">
            {mainAreaPlatforms.map((platform) =>
               renderLinkRow(
                  platform,
                  linkValues[platform] || '',
                  (value) => handleLinkChange(platform, value),
                  true, // Always show remove button
                  () => handleMoveToModal(platform)
               )
            )}
         </div>

         {/* More Links Button */}
         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
               <Button className="w-full py-6 bg-white text-spinet-text-muted hover:bg-slate-100 transition-all duration-200 border border-slate-200">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  More links
               </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
               <DialogHeader>
                  <DialogTitle>Recommended</DialogTitle>
               </DialogHeader>
               <div className="space-y-4">
                  <div className="space-y-3">
                     {modalPlatforms.slice(0, 5).map((platform) =>
                        renderLinkRow(platform, linkValues[platform] || '', (value) => handleLinkChange(platform, value))
                     )}
                  </div>

                  <div>
                     <h4 className="text-sm font-medium mb-3">Social media</h4>
                     <div className="space-y-3">
                        {modalPlatforms.slice(5).map((platform) =>
                           renderLinkRow(platform, linkValues[platform] || '', (value) => handleLinkChange(platform, value))
                        )}
                     </div>
                  </div>

                  <Button onClick={handleAddSelectedLinks} className="w-full">
                     Add selected links
                  </Button>
               </div>
            </DialogContent>
         </Dialog>

         {/* Current Links Display */}
         {data.links.length > 0 && (
            <div className="space-y-3">
               <h4 className="text-sm font-medium text-muted-foreground">Added Links ({data.links.length})</h4>
               <div className="space-y-2">
                  {data.links.map((link: any, index: number) => {
                     const platformKey = Object.keys(platformConfig).find(
                        key => platformConfig[key as keyof typeof platformConfig].name.toLowerCase() === link.platform.toLowerCase()
                     );
                     const config = platformKey ? platformConfig[platformKey as keyof typeof platformConfig] : null;

                     return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 border rounded-lg">
                           {config ? config.icon('w-6 h-6') : (
                              <div className="w-6 h-6 bg-gray-400 text-white rounded-lg flex items-center justify-center">
                                 <LinkIcon className="w-3 h-3" />
                              </div>
                           )}
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{link.platform}</p>
                              <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                           </div>
                           <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeLink(index)}
                              className="text-muted-foreground hover:text-destructive"
                           >
                              ×
                           </Button>
                        </div>
                     );
                  })}
               </div>
            </div>
         )}
      </div>
   );
}
