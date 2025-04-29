import Image from "next/image"
import {
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    Linkedin,
    Instagram,
    Twitter,
    Github,
    Edit,
    Lock,
    Bell,
    Activity,
    Settings,
    Shield,
    Key,
    Eye,
    EyeOff,
} from "lucide-react"
import useTranslate from '@/hooks/use-translate'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getProfile, ProfileData } from '@/lib/api/profile'
import SaveButton from "@/components/pages/profile/save-button"
import { cookies } from 'next/headers'
import { getUserCookieOnServer } from "@/utils/cookies"


export default async function ProfilePage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const { t } = await useTranslate(locale)
    const user = await getUserCookieOnServer();
    const profileId = user.selectedProfile;
    // Fetch user profile using getProfile
    let profileData: ProfileData | null

    try {
        // Now that we've fixed the URL encoding, we can use the actual profileId
        profileData = await getProfile(profileId)
        console.log("profileData", profileData)
    } catch (err: any) {
        console.error('Error fetching profile:', err)
        throw new Error(`Failed to load profile data: ${err.message}`)
    }

    // No fallback data - if profile can't be loaded, show error
    if (!profileData) {
        throw new Error('Profile data not found')
    }

    const fullName = `${profileData.firstName} ${profileData.lastName}`
    const profilePictureUrl = profileData.profilePicture ? `/api/files/${profileData.profilePicture}` : "/img/user.png"
    const coverImageUrl = profileData.profileCover ? `/api/files/${profileData.profileCover}` : ""

    return (
        <div className="min-h-screen w-full">
            {/* Profile Header */}
            <div className="relative h-96 bg-gradient-to-r from-blue-500 to-purple-600"
                style={coverImageUrl ? { backgroundImage: `url(${coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } :
                    profileData.theme?.color ? { backgroundColor: profileData.theme.color } : {}}>
                <div className="absolute -bottom-16 left-8">
                    <div className="relative">
                        <Image
                            src={profilePictureUrl}
                            alt={fullName}
                            width={128}
                            height={128}
                            className="rounded-full border-4 bg-white border-white dark:border-gray-800"
                        />
                        <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg">
                            <Edit className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="container mx-auto px-4 pt-20 pb-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {fullName}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                            {profileData.position} {profileData.companyName ? `at ${profileData.companyName}` : ""}
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="personal" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Personal Info
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Security
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Activity
                        </TabsTrigger>
                        <TabsTrigger value="preferences" className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Preferences
                        </TabsTrigger>
                    </TabsList>

                    {/* Personal Information Tab */}
                    <TabsContent value="personal" className="space-y-6">
                        <form id="personal-form">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold">Basic Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                defaultValue={profileData.firstName}
                                                disabled={profileData.lockedFeatures?.firstName}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                defaultValue={profileData.lastName}
                                                disabled={profileData.lockedFeatures?.lastName}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="birthDate">Birth Date</Label>
                                            <Input
                                                id="birthDate"
                                                type="date"
                                                defaultValue={profileData.birthDate ? new Date(profileData.birthDate).toISOString().split('T')[0] : ''}
                                                disabled={profileData.lockedFeatures?.birthDate}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="gender">Gender</Label>
                                            <Input
                                                id="gender"
                                                defaultValue={profileData.gender}
                                                disabled={profileData.lockedFeatures?.gender}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold">Professional Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="companyName">Company Name</Label>
                                            <Input
                                                id="companyName"
                                                defaultValue={profileData.companyName}
                                                disabled={profileData.lockedFeatures?.companyName}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="activitySector">Activity Sector</Label>
                                            <Input
                                                id="activitySector"
                                                defaultValue={profileData.activitySector}
                                                disabled={profileData.lockedFeatures?.activitySector}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="position">Position</Label>
                                            <Input
                                                id="position"
                                                defaultValue={profileData.position}
                                                disabled={profileData.lockedFeatures?.position}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="profileType">Profile Type</Label>
                                            <Input
                                                id="profileType"
                                                defaultValue={profileData.type}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {profileData.lockedFeatures?.canAddLinks && (
                                <div className="space-y-4 mt-8">
                                    <h2 className="text-lg font-semibold">Social Links</h2>
                                    <div className="space-y-4">
                                        {profileData.links && profileData.links.length > 0 ? (
                                            profileData.links.map((link, index) => (
                                                <div key={index} className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor={`link-title-${index}`}>Platform</Label>
                                                        <Input
                                                            id={`link-title-${index}`}
                                                            defaultValue={link.title}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`link-url-${index}`}>URL/Username</Label>
                                                        <Input
                                                            id={`link-url-${index}`}
                                                            defaultValue={link.link}
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <Label htmlFor={`link-name-${index}`}>Display Name</Label>
                                                        <Input
                                                            id={`link-name-${index}`}
                                                            defaultValue={link.name}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No social links added yet.</p>
                                        )}
                                        <Button variant="outline">Add New Link</Button>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end mt-6">
                                <SaveButton profileId={profileId || ''} sectionName="profile" />
                            </div>
                        </form>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="space-y-6">
                        <form id="security-form">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold">Password</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input id="current-password" type="password" />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input id="new-password" type="password" />
                                        </div>
                                        <div>
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input id="confirm-password" type="password" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Two-Factor Authentication</h3>
                                                <p className="text-sm text-gray-500">
                                                    Add an extra layer of security to your account
                                                </p>
                                            </div>
                                            <Button variant="default">
                                                Enable
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Active Sessions</h3>
                                                <p className="text-sm text-gray-500">
                                                    View your active sessions
                                                </p>
                                            </div>
                                            <Button variant="outline">View All</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <SaveButton profileId={profileId || ''} sectionName="security" />
                            </div>
                        </form>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity" className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Recent Activity</h2>
                            <div className="p-4 border rounded-lg">
                                <p className="text-center text-gray-500">No recent activity to display.</p>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Preferences Tab */}
                    <TabsContent value="preferences" className="space-y-6">
                        <form id="preferences-form">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold">Theme Settings</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="theme-color">Theme Color</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="theme-color"
                                                    type="color"
                                                    defaultValue={profileData.theme?.color || "#FFFFFF"}
                                                    className="w-16 h-10"
                                                    disabled={profileData.lockedFeatures?.theme}
                                                />
                                                <Input
                                                    id="theme-color-hex"
                                                    defaultValue={profileData.theme?.color || "#FFFFFF"}
                                                    className="flex-1"
                                                    disabled={profileData.lockedFeatures?.theme}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold">Feature Access</h2>
                                    <div className="space-y-2">
                                        {Object.entries(profileData.lockedFeatures || {}).map(([feature, isLocked]) =>
                                            feature !== 'excludedLinks' && (
                                                <div key={feature} className="flex items-center justify-between px-4 py-2 border rounded">
                                                    <span className="capitalize">{feature.replace(/([A-Z])/g, ' $1')}</span>
                                                    <span className={isLocked ? "text-red-500" : "text-green-500"}>
                                                        {isLocked ? "Locked" : "Unlocked"}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <SaveButton profileId={profileId || ''} sectionName="preferences" />
                            </div>
                        </form>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
} 