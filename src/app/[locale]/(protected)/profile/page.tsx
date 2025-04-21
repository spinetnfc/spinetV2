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
import { Textarea } from "@/components/ui/textarea"

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const { t } = await useTranslate(locale)

    // Mock user data - replace with actual user data from your backend
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        location: "New York, USA",
        bio: "Digital business card enthusiast and tech lover",
        avatar: "/img/user.png",
        socialLinks: {
            linkedin: "https://linkedin.com/in/johndoe",
            instagram: "https://instagram.com/johndoe",
            twitter: "https://twitter.com/johndoe",
            github: "https://github.com/johndoe",
            website: "https://johndoe.com",
        },
        security: {
            twoFactorEnabled: false,
            lastPasswordChange: "2024-03-15",
            activeSessions: 2,
        },
        activity: [
            {
                type: "login",
                description: "Logged in from New York, USA",
                timestamp: "2024-04-19T10:30:00Z",
            },
            {
                type: "profile_update",
                description: "Updated profile information",
                timestamp: "2024-04-18T15:45:00Z",
            },
            {
                type: "security",
                description: "Changed password",
                timestamp: "2024-04-15T09:20:00Z",
            },
        ],
    }

    return (
        <div className="min-h-screen w-full">
            {/* Profile Header */}
            <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="absolute -bottom-16 left-8">
                    <div className="relative">
                        <Image
                            src={user.avatar}
                            alt={user.name}
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
                            {user.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">{user.bio}</p>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Basic Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" defaultValue={user.name} />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" defaultValue={user.email} />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" defaultValue={user.phone} />
                                    </div>
                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Input id="location" defaultValue={user.location} />
                                    </div>
                                    <div>
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea id="bio" defaultValue={user.bio} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Social Links</h2>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="linkedin">LinkedIn</Label>
                                        <Input id="linkedin" defaultValue={user.socialLinks.linkedin} />
                                    </div>
                                    <div>
                                        <Label htmlFor="instagram">Instagram</Label>
                                        <Input id="instagram" defaultValue={user.socialLinks.instagram} />
                                    </div>
                                    <div>
                                        <Label htmlFor="twitter">Twitter</Label>
                                        <Input id="twitter" defaultValue={user.socialLinks.twitter} />
                                    </div>
                                    <div>
                                        <Label htmlFor="github">GitHub</Label>
                                        <Input id="github" defaultValue={user.socialLinks.github} />
                                    </div>
                                    <div>
                                        <Label htmlFor="website">Website</Label>
                                        <Input id="website" defaultValue={user.socialLinks.website} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button>Save Changes</Button>
                        </div>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="space-y-6">
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
                                        <Button variant={user.security.twoFactorEnabled ? "destructive" : "default"}>
                                            {user.security.twoFactorEnabled ? "Disable" : "Enable"}
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Active Sessions</h3>
                                            <p className="text-sm text-gray-500">
                                                {user.security.activeSessions} active sessions
                                            </p>
                                        </div>
                                        <Button variant="outline">View All</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button>Update Security Settings</Button>
                        </div>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity" className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Recent Activity</h2>
                            <div className="space-y-4">
                                {user.activity.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 border rounded-lg"
                                    >
                                        <div className="mt-1">
                                            {activity.type === "login" && <User className="w-5 h-5" />}
                                            {activity.type === "profile_update" && <Edit className="w-5 h-5" />}
                                            {activity.type === "security" && <Shield className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-medium">{activity.description}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(activity.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Preferences Tab */}
                    <TabsContent value="preferences" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Notifications</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Email Notifications</h3>
                                            <p className="text-sm text-gray-500">
                                                Receive notifications via email
                                            </p>
                                        </div>
                                        <Button variant="outline">Configure</Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Push Notifications</h3>
                                            <p className="text-sm text-gray-500">
                                                Receive push notifications
                                            </p>
                                        </div>
                                        <Button variant="outline">Configure</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Privacy</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Profile Visibility</h3>
                                            <p className="text-sm text-gray-500">
                                                Control who can see your profile
                                            </p>
                                        </div>
                                        <Button variant="outline">Configure</Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Data Sharing</h3>
                                            <p className="text-sm text-gray-500">
                                                Manage your data sharing preferences
                                            </p>
                                        </div>
                                        <Button variant="outline">Configure</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button>Save Preferences</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
} 