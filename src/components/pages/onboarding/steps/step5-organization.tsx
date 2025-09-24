'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useOnboardingStore } from '@/lib/store/onboarding/onboarding-store';
import { useClientTranslate } from '@/hooks/use-client-translate';
import {
   Building,
   Users,
   Mail,
   UserPlus,
   X,
   Shield,
   User,
   CheckCircle,
   Clock,
   Plus
} from 'lucide-react';
import { OrganizationMember } from '@/types/onboarding';

export default function Step5Organization() {
   const { t } = useClientTranslate();
   const {
      data,
      updateOrganization,
      updateOrganizationName,
      addOrganizationMember,
      removeOrganizationMember
   } = useOnboardingStore();

   const [newMemberEmail, setNewMemberEmail] = useState('');
   const [newMemberRole, setNewMemberRole] = useState<'admin' | 'member'>('member');
   const [skipOrganization, setSkipOrganization] = useState(!data.organization);

   const handleOrganizationNameChange = (name: string) => {
      if (!name.trim() && data.organization) {
         // If name is cleared, set to skip mode
         setSkipOrganization(true);
         updateOrganization(null);
      } else if (name.trim()) {
         // If name is provided, create or update organization
         setSkipOrganization(false);
         if (data.organization) {
            updateOrganizationName(name);
         } else {
            updateOrganization({
               name: name,
               members: [],
            });
         }
      }
   };

   const handleAddMember = () => {
      if (newMemberEmail && data.organization) {
         const newMember: OrganizationMember = {
            email: newMemberEmail,
            role: newMemberRole,
            status: 'pending',
         };
         addOrganizationMember(newMember);
         setNewMemberEmail('');
         setNewMemberRole('member');
      }
   };

   const handleToggleSkip = () => {
      setSkipOrganization(!skipOrganization);
      if (!skipOrganization) {
         // Switching to skip mode
         updateOrganization(null);
      } else {
         // Switching to setup mode
         updateOrganization({
            name: '',
            members: [],
         });
      }
   };

   const getRoleIcon = (role: 'admin' | 'member') => {
      return role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />;
   };

   const getStatusIcon = (status: 'pending' | 'accepted') => {
      return status === 'accepted' ?
         <CheckCircle className="w-3 h-3 text-green-500" /> :
         <Clock className="w-3 h-3 text-yellow-500" />;
   };

   return (
      <div className="space-y-6">
         {/* Skip/Setup Toggle */}
         <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
               <Building className="w-5 h-5" />
               <div>
                  <h3 className="font-medium text-sm">
                     {t('onboarding.organization-setup')}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                     {t('onboarding.organization-optional')}
                  </p>
               </div>
            </div>
            <Button
               variant={skipOrganization ? "outline" : "default"}
               size="sm"
               onClick={handleToggleSkip}
            >
               {skipOrganization ? t('onboarding.setup-org') : t('onboarding.skip-for-now')}
            </Button>
         </div>

         {!skipOrganization && (
            <>
               {/* Organization Name */}
               <div className="space-y-3">
                  <Label htmlFor="orgName" className="text-base font-medium">
                     {t('onboarding.organization-name')}
                  </Label>
                  <Input
                     id="orgName"
                     type="text"
                     value={data.organization?.name || ''}
                     onChange={(e) => handleOrganizationNameChange(e.target.value)}
                     placeholder={t('onboarding.organization-name-placeholder')}
                     className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                     {t('onboarding.organization-name-description')}
                  </p>
               </div>

               {data.organization && (
                  <>
                     {/* Add Members Section */}
                     <div className="space-y-4 p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-2">
                           <UserPlus className="w-4 h-4" />
                           <h3 className="font-medium">{t('onboarding.invite-members')}</h3>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                           <div className="flex-1">
                              <Input
                                 type="email"
                                 value={newMemberEmail}
                                 onChange={(e) => setNewMemberEmail(e.target.value)}
                                 placeholder={t('onboarding.member-email-placeholder')}
                              />
                           </div>
                           <div className="flex gap-2">
                              <Button
                                 variant={newMemberRole === 'member' ? 'default' : 'outline'}
                                 size="sm"
                                 onClick={() => setNewMemberRole('member')}
                              >
                                 <User className="w-3 h-3 mr-1" />
                                 {t('onboarding.member')}
                              </Button>
                              <Button
                                 variant={newMemberRole === 'admin' ? 'default' : 'outline'}
                                 size="sm"
                                 onClick={() => setNewMemberRole('admin')}
                              >
                                 <Shield className="w-3 h-3 mr-1" />
                                 {t('onboarding.admin')}
                              </Button>
                           </div>
                           <Button
                              onClick={handleAddMember}
                              disabled={!newMemberEmail.trim()}
                           >
                              <Plus className="w-4 h-4 mr-2" />
                              {t('onboarding.invite')}
                           </Button>
                        </div>
                     </div>

                     {/* Current Members */}
                     {data.organization.members.length > 0 && (
                        <div className="space-y-3">
                           <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <Label className="text-sm font-medium">
                                 {t('onboarding.team-members')} ({data.organization.members.length})
                              </Label>
                           </div>
                           <div className="space-y-2">
                              {data.organization.members.map((member: OrganizationMember, index: number) => (
                                 <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-background border border-border rounded-lg"
                                 >
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                          <Mail className="w-4 h-4" />
                                       </div>
                                       <div>
                                          <p className="text-sm font-medium">{member.email}</p>
                                          <div className="flex items-center gap-2 mt-1">
                                             <Badge variant="outline" className="text-xs">
                                                {getRoleIcon(member.role)}
                                                <span className="ml-1">{member.role}</span>
                                             </Badge>
                                             <div className="flex items-center gap-1">
                                                {getStatusIcon(member.status)}
                                                <span className="text-xs text-muted-foreground">
                                                   {member.status}
                                                </span>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                    <Button
                                       size="sm"
                                       variant="ghost"
                                       onClick={() => removeOrganizationMember(index)}
                                       className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                       <X className="w-4 h-4" />
                                    </Button>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Organization Summary */}
                     <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-start gap-3">
                           <Building className="w-5 h-5 text-primary mt-0.5" />
                           <div className="flex-1">
                              <h4 className="font-medium text-primary mb-1">
                                 {data.organization.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                 {data.organization.members.length === 0
                                    ? t('onboarding.org-ready-to-start')
                                    : t('onboarding.org-with-members', { count: data.organization.members.length })
                                 }
                              </p>
                           </div>
                        </div>
                     </div>
                  </>
               )}
            </>
         )}

         {skipOrganization && (
            <div className="text-center p-8 bg-muted/30 rounded-lg">
               <Building className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
               <h3 className="font-medium mb-2">
                  {t('onboarding.individual-setup')}
               </h3>
               <p className="text-sm text-muted-foreground mb-4">
                  {t('onboarding.individual-description')}
               </p>
               <p className="text-xs text-muted-foreground">
                  {t('onboarding.can-setup-org-later')}
               </p>
            </div>
         )}
      </div>
   );
}
