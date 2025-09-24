'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useOnboardingViewModel } from '@/lib/viewmodels/onboarding/onboarding.viewmodel';
import { useClientTranslate } from '@/hooks/use-client-translate';
import { Upload, X, Camera, User } from 'lucide-react';

export default function Step3ProfilePicture() {
   const { t } = useClientTranslate();
   const { data, errors, isLoading, uploadProfilePicture, removeProfilePicture } = useOnboardingViewModel();
   const [dragActive, setDragActive] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const handleFileSelect = (file: File) => {
      if (file && file.type.startsWith('image/')) {
         uploadProfilePicture(file);
      }
   };

   const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragenter' || e.type === 'dragover') {
         setDragActive(true);
      } else if (e.type === 'dragleave') {
         setDragActive(false);
      }
   };

   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         handleFileSelect(e.dataTransfer.files[0]);
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
         handleFileSelect(e.target.files[0]);
      }
   };

   const openFileDialog = () => {
      fileInputRef.current?.click();
   };

   const handleRemoveProfilePicture = () => {
      removeProfilePicture();
   };

   return (
      <div className="space-y-6">
         <div className="text-center">
            <Label className="text-base font-medium">
               {t('onboarding.profile-picture-label')}
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
               {t('onboarding.profile-picture-description')}
            </p>
         </div>

         {data.profilePicture ? (
            /* Current Profile Picture */
            <div className="flex flex-col items-center space-y-4">
               <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border">
                     <img
                        src={data.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                     />
                  </div>
                  <Button
                     size="sm"
                     variant="destructive"
                     className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                     onClick={handleRemoveProfilePicture}
                  >
                     <X className="w-4 h-4" />
                  </Button>
               </div>
               <Button variant="outline" onClick={openFileDialog}>
                  <Camera className="w-4 h-4 mr-2" />
                  {t('onboarding.change-picture')}
               </Button>
            </div>
         ) : (
            /* Upload Area */
            <div
               className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
               onDragEnter={handleDrag}
               onDragLeave={handleDrag}
               onDragOver={handleDrag}
               onDrop={handleDrop}
            >
               <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                     <User className="w-8 h-8 text-muted-foreground" />
                  </div>

                  <div className="space-y-2">
                     <h3 className="text-lg font-medium">
                        {t('onboarding.upload-picture')}
                     </h3>
                     <p className="text-sm text-muted-foreground">
                        {t('onboarding.drag-drop-or-click')}
                     </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                     <Button onClick={openFileDialog}>
                        <Upload className="w-4 h-4 mr-2" />
                        {t('onboarding.select-file')}
                     </Button>
                     <Button
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => {
                           // Create a mock file for placeholder
                           fetch('https://via.placeholder.com/150')
                              .then(res => res.blob())
                              .then(blob => {
                                 const file = new File([blob], 'placeholder.jpg', { type: 'image/jpeg' });
                                 uploadProfilePicture(file);
                              })
                              .catch(() => {
                                 // Fallback: direct URL assignment (for demo purposes)
                                 console.log('Using placeholder image');
                              });
                        }}
                     >
                        <Camera className="w-4 h-4 mr-2" />
                        {t('onboarding.use-placeholder')}
                     </Button>
                  </div>
               </div>

               <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
               />
            </div>
         )}

         {/* Error Display */}
         {errors.profilePicture && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
               <p className="text-sm text-destructive">
                  {errors.profilePicture}
               </p>
            </div>
         )}

         {/* File Requirements */}
         <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
               <strong>{t('onboarding.requirements')}:</strong>
            </p>
            <ul className="text-sm text-muted-foreground mt-1 space-y-1">
               <li>• {t('onboarding.max-file-size')}</li>
               <li>• {t('onboarding.supported-formats')}</li>
               <li>• {t('onboarding.recommended-size')}</li>
            </ul>
         </div>
      </div>
   );
}
