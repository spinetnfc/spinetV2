"use client"

import { useState } from "react"
import { ArrowLeft, Edit2, Check, X, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
    // State for editable fields
    const [email, setEmail] = useState("abderrahmanebakdi@gmail.com")
    const [phone, setPhone] = useState("+213794257091")
    const [profileLink, setProfileLink] = useState("https://spinetnfc.com/profil...")
    const [language, setLanguage] = useState("English")
    const [searchable, setSearchable] = useState(true)

    // State for editing modes
    const [editingEmail, setEditingEmail] = useState(false)
    const [editingPhone, setEditingPhone] = useState(false)
    const [editingProfileLink, setEditingProfileLink] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)

    // Password change state
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    })

    // Temporary values for editing
    const [tempEmail, setTempEmail] = useState(email)
    const [tempPhone, setTempPhone] = useState(phone)
    const [tempProfileLink, setTempProfileLink] = useState(profileLink)

    const handleSaveEmail = () => {
        setEmail(tempEmail)
        setEditingEmail(false)
    }

    const handleCancelEmail = () => {
        setTempEmail(email)
        setEditingEmail(false)
    }

    const handleSavePhone = () => {
        setPhone(tempPhone)
        setEditingPhone(false)
    }

    const handleCancelPhone = () => {
        setTempPhone(phone)
        setEditingPhone(false)
    }

    const handleSaveProfileLink = () => {
        setProfileLink(tempProfileLink)
        setEditingProfileLink(false)
    }

    const handleCancelProfileLink = () => {
        setTempProfileLink(profileLink)
        setEditingProfileLink(false)
    }

    const handlePasswordChange = () => {
        if (newPassword !== confirmPassword) {
            alert("New passwords don't match!")
            return
        }
        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters long!")
            return
        }
        // Here you would typically make an API call to change the password
        alert("Password changed successfully!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setChangingPassword(false)
    }

    const handleSignOut = () => {
        if (confirm("Are you sure you want to sign out?")) {
            // Handle sign out logic here
            alert("Signed out successfully!")
        }
    }

    return (
        <div className="min-h-screen">
            {/* Header
            <div className="border-b border-gray-200 px-4 py-4 flex items-center">
                <Button variant="ghost" size="icon" className="mr-3">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold">Settings</h1>
            </div> */}

            {/* Settings Content */}
            <div className="p-4 space-y-4">
                {/* Email Section */}
                <Card className="p-4">
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email address</Label>
                        {editingEmail ? (
                            <div className="space-y-3">
                                <Input
                                    type="email"
                                    value={tempEmail}
                                    onChange={(e) => setTempEmail(e.target.value)}
                                    className="w-full"
                                />
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={handleSaveEmail}>
                                        <Check className="h-4 w-4 mr-1" />
                                        Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={handleCancelEmail}>
                                        <X className="h-4 w-4 mr-1" />
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">{email}</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setTempEmail(email)
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
                            <div className="space-y-3">
                                <Input type="tel" value={tempPhone} onChange={(e) => setTempPhone(e.target.value)} className="w-full" />
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={handleSavePhone}>
                                        <Check className="h-4 w-4 mr-1" />
                                        Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={handleCancelPhone}>
                                        <X className="h-4 w-4 mr-1" />
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">{phone}</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setTempPhone(phone)
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
                    <div className="space-y-3">
                        <button
                            className="w-full flex items-center justify-between text-left"
                            onClick={() => setChangingPassword(!changingPassword)}
                        >
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Change password</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{changingPassword ? "Cancel" : "Click to change"}</span>
                        </button>

                        {changingPassword && (
                            <div className="space-y-4 pt-3 border-t">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="current-password"
                                            type={showPasswords.current ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                                        >
                                            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="new-password"
                                            type={showPasswords.new ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                                        >
                                            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirm-password"
                                            type={showPasswords.confirm ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                                        >
                                            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={handlePasswordChange}>Change Password</Button>
                                    <Button variant="outline" onClick={() => setChangingPassword(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Profile Link */}
                <Card className="p-4">
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile link</Label>
                        {editingProfileLink ? (
                            <div className="space-y-3">
                                <Input
                                    type="url"
                                    value={tempProfileLink}
                                    onChange={(e) => setTempProfileLink(e.target.value)}
                                    className="w-full"
                                />
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={handleSaveProfileLink}>
                                        <Check className="h-4 w-4 mr-1" />
                                        Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={handleCancelProfileLink}>
                                        <X className="h-4 w-4 mr-1" />
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400 truncate flex-1 mr-2">{profileLink}</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setTempProfileLink(profileLink)
                                        setEditingProfileLink(true)
                                    }}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Edit Profile */}
                <Card className="p-4">
                    <button className="w-full text-left">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Edit profile</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update your profile information and photo</p>
                    </button>
                </Card>

                {/* Change Language */}
                <Card className="p-4">
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
                </Card>

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
                <Card className="p-4 border-red-600">
                    <button className="w-full text-left" onClick={handleSignOut}>
                        <span className="text-red-600 font-medium">Sign out</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign out of your account</p>
                    </button>
                </Card>
            </div>
        </div>
    )
}
