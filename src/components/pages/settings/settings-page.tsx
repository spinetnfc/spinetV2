"use client"

import { useState } from "react"
import { ArrowLeft, Edit2, Check, X, Eye, EyeOff, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "@/types/user"
import { useEffect } from "react"
import ChangeEmailForm from "../profile/change-email-form"
import ChangePhoneForm from "../profile/change-phone"
import Link from "next/link"
import { getLocale } from "@/utils/getClientLocale"
import { useAuth } from "@/context/authContext"

export default function SettingsPage({ user }: { user: Promise<User | null> }) {
    // State for resolved user
    const [resolvedUser, setResolvedUser] = useState<User | null>(null)

    useEffect(() => {
        user.then(setResolvedUser)
    }, [user])

    // State for editable fields
    const [email, setEmail] = useState<string | undefined>(undefined)
    const [phone, setPhone] = useState<string | undefined>(undefined)
    const [profileLink, setProfileLink] = useState<string | undefined>(undefined)
    const [language, setLanguage] = useState<string | undefined>(undefined)
    const [searchable, setSearchable] = useState<boolean>(false)
    const { logout } = useAuth();
    useEffect(() => {
        if (resolvedUser) {
            setEmail(resolvedUser.email)
            setPhone(resolvedUser.phoneNumber)
            setProfileLink(`https://spinettest.vercel.app/${locale}/public-profile/${resolvedUser.selectedProfile}`)//tbd
            setLanguage(resolvedUser.language)
            setSearchable(true)//tbd
        }
    }, [resolvedUser])

    // State for editing modes
    const [editingEmail, setEditingEmail] = useState(false)
    const [editingPhone, setEditingPhone] = useState(false)
    const [copied, setCopied] = useState(false);

    // Temporary values for editing
    const [tempPhone, setTempPhone] = useState(phone)

    const locale = getLocale() || "en"

    const handleCancelEmail = () => {
        setEditingEmail(false)
    }

    const handleCancelPhone = () => {
        setTempPhone(phone)
        setEditingPhone(false)
    }

    const handleCopy = async () => {
        try {
            if (!profileLink) {
                return;
            }
            await navigator.clipboard.writeText(profileLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2s
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };


    return (
        <div className="min-h-screen">

            {/* Settings Content */}
            <div className="p-4 space-y-4">
                {/* Email Section */}
                <Card className="p-4">
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email address</Label>
                        {editingEmail ? (
                            resolvedUser && <ChangeEmailForm user={resolvedUser} onCancel={handleCancelEmail} />
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">{email}</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setEditingEmail(true)
                                    }}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Phone Section */}
                <Card className="p-4">
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone number</Label>
                        {editingPhone ? (
                            resolvedUser && <ChangePhoneForm user={resolvedUser} onCancel={handleCancelPhone} />
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">{phone}</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setEditingPhone(true)
                                    }}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Change Password */}
                <Card className="p-4">
                    <Link
                        href={`/${locale}/auth/forgot-password`}
                        className="block w-full h-full text-sm"
                    >
                        Change password
                    </Link>
                </Card>

                {/* Profile Link */}
                <Card className="p-4">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Profile Link</span>
                    <div className="flex items-center justify-between w-full gap-2">
                        <p className="min-w-0 text-gray-500 text-sm dark:text-gray-400 break-all">
                            {profileLink}
                        </p>
                        <Button size="icon" variant="ghost" className="shrink-0" onClick={handleCopy}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </Card>


                {/* Edit Profile */}
                <Card className="p-4">

                    <Link
                        href={`/${locale}/profile/update-info`}
                        className="block w-full h-full text-sm"
                    >
                        Edit Profile
                    </Link>
                </Card>

                {/* Change Theme */}

                {/* Change Language */}
                {/* <Card className="p-4">
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="French">Français</SelectItem>
                                <SelectItem value="Arabic">العربية</SelectItem>
                                <SelectItem value="Spanish">Español</SelectItem>
                                <SelectItem value="German">Deutsch</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </Card> */}

                {/* Search Privacy Toggle */}
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Allow people to find me in search</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {searchable ? "Your profile is discoverable" : "Your profile is private"}
                            </p>
                        </div>
                        <Switch checked={searchable} onCheckedChange={setSearchable} />
                    </div>
                </Card>

                {/* Account Expiration Notice */}
                <Card className="p-4 border-amber-800">
                    <div className="text-amber-800">
                        <span className="font-medium">Professional Account</span>
                        <p className="text-sm mt-1">Your professional account expires on 2024-01-30</p>
                    </div>
                </Card>

                {/* Sign Out */}
                <Card className="p-4 border-red-600 cursor-pointer" onClick={logout}>
                    <span className="text-red-600 font-medium">Sign out</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign out of your account</p>
                </Card>
            </div>
        </div>
    )
}
