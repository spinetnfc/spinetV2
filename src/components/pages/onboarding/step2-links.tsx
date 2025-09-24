'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useOnboardingStore } from '@/lib/store/onboarding/onboarding-store';
import { useClientTranslate } from '@/hooks/use-client-translate';
import { X, Plus, Link as LinkIcon } from 'lucide-react';
import { UserLink } from '@/types/onboarding';

export default function Step2Links() {
   const { t } = useClientTranslate();
   const { data, addLink, removeLink } = useOnboardingStore();
   const [newPlatform, setNewPlatform] = useState('');
   const [newUrl, setNewUrl] = useState('');

   const isValidUrl = (url: string): boolean => {
      try {
         new URL(url);
         return true;
      } catch {
         return false;
      }
   };

   const getHostname = (url: string): string => {
      try {
         return new URL(url).hostname;
      } catch {
         return 'Invalid URL';
      }
   };

   const handleAddLink = () => {
      if (newPlatform && newUrl) {
         // Add validation check for URL
         if (!isValidUrl(newUrl)) {
            // Could show a toast or error message here
            console.error('Invalid URL format:', newUrl);
            return;
         }

         addLink({
            platform: newPlatform,
            url: newUrl,
         });
         setNewPlatform('');
         setNewUrl('');
      }
   };

   const handleRemoveLink = (index: number) => {
      removeLink(index);
   };

   const popularPlatforms = [
      'Instagram',
      'Twitter',
      'LinkedIn',
      'Facebook',
      'GitHub',
      'Website',
      'YouTube',
      'TikTok',
   ];

   return (
      <div className="space-y-6">
         {/* Add New Link */}
         <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
               <LinkIcon className="w-4 h-4" />
               <h3 className="font-medium">{t('onboarding.add-link')}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label htmlFor="platform">{t('onboarding.platform')}</Label>
                  <Input
                     id="platform"
                     value={newPlatform}
                     onChange={(e) => setNewPlatform(e.target.value)}
                     placeholder={t('onboarding.platform-placeholder')}
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="url">{t('onboarding.url')}</Label>
                  <Input
                     id="url"
                     type="url"
                     value={newUrl}
                     onChange={(e) => setNewUrl(e.target.value)}
                     placeholder={t('onboarding.url-placeholder')}
                     className={newUrl.trim() && !isValidUrl(newUrl) ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {newUrl.trim() && !isValidUrl(newUrl) && (
                     <p className="text-xs text-destructive">
                        Please enter a valid URL (e.g., https://example.com)
                     </p>
                  )}
               </div>
            </div>

            <Button
               onClick={handleAddLink}
               disabled={!newPlatform.trim() || !newUrl.trim() || (!!newUrl && !isValidUrl(newUrl))}
               className="w-full sm:w-auto"
            >
               <Plus className="w-4 h-4 mr-2" />
               {t('onboarding.add-link')}
            </Button>
         </div>

         {/* Popular Platforms */}
         <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">
               {t('onboarding.popular-platforms')}
            </Label>
            <div className="flex flex-wrap gap-2">
               {popularPlatforms.map((platform) => (
                  <Badge
                     key={platform}
                     variant="outline"
                     className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                     onClick={() => setNewPlatform(platform)}
                  >
                     {platform}
                  </Badge>
               ))}
            </div>
         </div>

         {/* Current Links */}
         {data.links.length > 0 && (
            <div className="space-y-3">
               <Label className="text-sm font-medium">
                  {t('onboarding.your-links')} ({data.links.length})
               </Label>
               <div className="space-y-2">
                  {data.links.map((link: UserLink, index: number) => (
                     <div
                        key={index}
                        className={`flex items-center justify-between p-3 bg-background border rounded-lg ${isValidUrl(link.url)
                              ? 'border-border'
                              : 'border-destructive/50 bg-destructive/5'
                           }`}
                     >
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{link.platform}</span>
                              <Badge variant="secondary" className="text-xs">
                                 {getHostname(link.url)}
                              </Badge>
                           </div>
                           <p className="text-sm text-muted-foreground truncate">
                              {link.url}
                           </p>
                        </div>
                        <Button
                           size="sm"
                           variant="ghost"
                           onClick={() => handleRemoveLink(index)}
                           className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                           <X className="w-4 h-4" />
                        </Button>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* Help Text */}
         <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
               {t('onboarding.links-help')}
            </p>
         </div>
      </div>
   );
}
