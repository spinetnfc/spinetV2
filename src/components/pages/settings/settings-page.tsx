"use client"

import { useState, useEffect } from "react"
import { Edit2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { User } from "@/types/user"
import ChangeEmailForm from "../profile/change-email-form"
import ChangePhoneForm from "../profile/change-phone"
import Link from "next/link"
import { getLocale } from "@/utils/getClientLocale"
import { useUser } from "@/lib/store/auth/auth-store"
// TODO: useLogout will be moved to ViewModel when implemented
import { toast } from "sonner"
import { useIntl, FormattedMessage } from "react-intl"

export default function SettingsPage({ user }: { user: Promise<User | null> }) {
    const [resolvedUser, setResolvedUser] = useState<User | null>(null)
    const [email, setEmail] = useState<string | undefined>(undefined)
    const [phone, setPhone] = useState<string | undefined>(undefined)
    const [profileLink, setProfileLink] = useState<string | undefined>(undefined)
    const [language, setLanguage] = useState<string | undefined>(undefined)
    const [searchable, setSearchable] = useState<boolean>(false)
    // const logout = useLogout() // TODO: Will be handled by ViewModel
    const intl = useIntl()

    useEffect(() => {
        user.then(setResolvedUser)
    }, [user])

    useEffect(() => {
        if (resolvedUser) {
            setEmail(resolvedUser.email)
            setPhone(resolvedUser.phoneNumber)
            setProfileLink(`https://spinettest.vercel.app/${locale}/public-profile/${resolvedUser.selectedProfile}`)
            setLanguage(resolvedUser.language)
            setSearchable(true)
        }
    }, [resolvedUser])

    const [editingEmail, setEditingEmail] = useState(false)
    const [editingPhone, setEditingPhone] = useState(false)
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
            if (!profileLink) return
            await navigator.clipboard.writeText(profileLink)
            toast.success(intl.formatMessage({ id: "profile-url-copied" }))
        } catch (err) {
            console.error("Failed to copy:", err)
            toast.error(intl.formatMessage({ id: "failed-copy-profile-link" }))
        }
    }

    return (
        <div className="min-h-screen">
            <div className="p-4 space-y-4">
                {/* Email Section */}
                <Card className="p-4">
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            <FormattedMessage id="email-address" defaultMessage="Email address" />
                        </Label>
                        {editingEmail ? (
                            resolvedUser && <ChangeEmailForm user={resolvedUser} onCancel={handleCancelEmail} />
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">{email}</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingEmail(true)}
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
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            <FormattedMessage id="phone-number" defaultMessage="Phone number" />
                        </Label>
                        {editingPhone ? (
                            resolvedUser && <ChangePhoneForm user={resolvedUser} onCancel={handleCancelPhone} />
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">{phone}</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingPhone(true)}
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
                        <FormattedMessage id="change-password" defaultMessage="Change password" />
                    </Link>
                </Card>

                {/* Profile Link */}
                <Card className="p-4">
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                        <FormattedMessage id="profile-link" defaultMessage="Profile Link" />
                    </span>
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
                        href={`/${locale}/app/profile/update-info`}
                        className="block w-full h-full text-sm"
                    >
                        <FormattedMessage id="edit-profile" defaultMessage="Edit Profile" />
                    </Link>
                </Card>

                {/* Change Language */}
                {/* <Card className="p-4">
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            <FormattedMessage id="language" defaultMessage="Language" />
                        </Label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="English">
                                    <FormattedMessage id="language.english" defaultMessage="English" />
                                </SelectItem>
                                <SelectItem value="French">
                                    <FormattedMessage id="language.french" defaultMessage="Français" />
                                </SelectItem>
                                <SelectItem value="Arabic">
                                    <FormattedMessage id="language.arabic" defaultMessage="العربية" />
                                </SelectItem>
                                <SelectItem value="Spanish">
                                    <FormattedMessage id="language.spanish" defaultMessage="Español" />
                                </SelectItem>
                                <SelectItem value="German">
                                    <FormattedMessage id="language.german" defaultMessage="Deutsch" />
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </Card> */}

                {/* Search Privacy Toggle */}
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                <FormattedMessage id="allow-search" defaultMessage="Allow people to find me in search" />
                            </span>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <FormattedMessage
                                    id={searchable ? "profile-discoverable" : "profile-private"}
                                    defaultMessage={searchable ? "Your profile is discoverable" : "Your profile is private"}
                                />
                            </p>
                        </div>
                        <Switch checked={searchable} onCheckedChange={setSearchable} />
                    </div>
                </Card>

                {/* Account Expiration Notice */}
                <Card className="p-4 border-amber-800">
                    <div className="text-amber-800">
                        <span className="font-medium">
                            <FormattedMessage id="professional-account" defaultMessage="Professional Account" />
                        </span>
                        <p className="text-sm mt-1">
                            <FormattedMessage
                                id="account-expiration"
                                defaultMessage="Your professional account expires on {date}"
                                values={{ date: "2024-01-30" }}
                            />
                        </p>
                    </div>
                </Card>

                {/* Sign Out */}
                <Card className="p-4 border-red-600 cursor-pointer" onClick={() => {
                    // TODO: Implement logout via ViewModel
                    console.log('Logout clicked - will be handled by ViewModel');
                }}>
                    <span className="text-red-600 font-medium">
                        <FormattedMessage id="sign-out" defaultMessage="Sign out" />
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <FormattedMessage id="sign-out-description" defaultMessage="Sign out of your account" />
                    </p>
                </Card>
            </div>
        </div>
    )
}