"use client"

import { useState, useEffect } from "react"
import { Bell, Check, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/authContext"
import avatar from "@/assets/images/user.png"
import { Invitation, NotificationItem } from "@/types/notifications"
import { api } from "@/lib/axios"
import { acceptInvitation, markNotificationsAsRead } from "@/lib/api/notifications"
import { set } from "date-fns"

interface NotificationDropdownProps {
    locale: string
    pollingInterval?: number
}

export default function NotificationDropdown({ pollingInterval = 30000, locale }: NotificationDropdownProps) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [invitations, setInvitations] = useState<Invitation[]>([])
    const [activeTab, setActiveTab] = useState<"received" | "invitations">("received")
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAuth()
    const profileId = user.selectedProfile

    // Fetch only notifications
    const fetchNotifications = async () => {
        if (!profileId) return
        setIsLoading(true)
        try {
            const notificationsResponse = await api.post(`/profile/${profileId}/notifications/filter`, { limit: 10, skip: 0 })
            const receivedNotifications = notificationsResponse.data.received || []
            setNotifications(receivedNotifications)
            const unreadNotifications = receivedNotifications.filter(
                (notification: NotificationItem) => !notification.read && !notification.readBy?.includes(profileId)
            )
            setUnreadCount(unreadNotifications.length)
        } catch (error) {
            console.error("Error fetching notifications:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch invitations
    const fetchInvitations = async () => {
        if (!profileId) return
        setIsLoading(true)
        try {
            const invitationsResponse = await api.post(`/profile/${profileId}/invitations`, { limit: 10, skip: 0 })
            setInvitations(invitationsResponse.data || [])
        } catch (error) {
            console.error("Error fetching invitations:", error)
        } finally {
            setIsLoading(false)
        }
    }


    // Handle dropdown open/close
    const handleDropdownOpenChange = (open: boolean) => {
        setIsOpen(open)
        fetchInvitations()
        if (open && invitations.length === 0) {
            fetchInvitations() // Fetch invitations when dropdown is opened and no invitations are loaded
        }
    }

    useEffect(() => {
        fetchNotifications()
        //polling for notifications
        const interval = setInterval(fetchNotifications, pollingInterval)
        return () => clearInterval(interval)
    }, [profileId, pollingInterval])

    // Mark notification as read
    const markAsRead = async (notificationId: string) => {
        try {
            const response = await markNotificationsAsRead(profileId, [notificationId])
            if (response.status === 200) {
                setNotifications((prev) =>
                    prev.map((n) => (n._id === notificationId ? { ...n, read: true, readBy: [...(n.readBy || []), profileId] } : n))
                )
                setUnreadCount((prev) => Math.max(0, prev - 1))
            }
        }
        catch (error) {
            console.error("Error marking notification as read:", error)
            return
        }

    }

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            const response = await markNotificationsAsRead(profileId, notifications.map(n => n._id))
            if (response.status === 200) {
                setNotifications((prev) =>
                    prev.map((n) => ({
                        ...n,
                        read: true,
                        readBy: [...(n.readBy || []), profileId],
                    }))
                )
                setUnreadCount(0)
            }

        } catch (error) {
            console.error("Error marking all notifications as read:", error)
        }
    }

    // Get notification type styling
    const getNotificationTypeColor = (type?: string) => {
        switch (type) {
            case "invitation":
                return "text-azure bg-blue-50"
            case "message":
                return "text-green-600 bg-green-50"
            case "system-automated":
                return "text-purple-600 bg-purple-50"
            case "system-manual":
                return "text-amber-600 bg-amber-50"
            default:
                return "text-gray-600 bg-gray-50"
        }
    }

    // Get sender display info for notifications
    const getSenderInfo = (notification: NotificationItem) => {
        if (notification.fromType === "system" || notification.fromType === "admin") {
            return {
                name: "SPINET System",
                avatar: null,
                isSystem: true,
            }
        }

        if (notification.Sender) {
            const sender = notification.Sender
            return {
                name:
                    sender.fullName ||
                    `${sender.firstName || ""} ${sender.lastName || ""}`.trim() ||
                    sender.name ||
                    "Unknown User",
                avatar: sender.logo,
                isSystem: false,
            }
        }

        return {
            name: "Unknown Sender",
            avatar: null,
            isSystem: false,
        }
    }

    // Get sender display info for invitations
    const getInvitationSenderInfo = (invitation: Invitation) => {
        const profile = invitation.Profile
        return {
            name: profile.fullName ? profile.fullName : `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "Unknown User",
            avatar: profile.profilePicture || null,
            isSystem: false,
        }
    }

    const handleAcceptInvitation = async (profileId: string, invitationId: string) => {
        try {
            const response = await acceptInvitation(profileId, invitationId);
            if (response.status === 200) {
                setInvitations((prev) => prev.filter((inv) => inv._id !== invitationId))
            }
        } catch (error) {
            console.error("Error accepting invitation:", error);
        }
    }
    const handleRefuseInvitation = async (profileId: string, invitationId: string) => {
        try {
            const response = await api.post(`/profile/${profileId}/invitation/${invitationId}/refuse`);
            if (response.status === 200) {
                setInvitations((prev) => prev.filter((inv) => inv._id !== invitationId))
            }
        } catch (error) {
            console.error("Error refusing invitation:", error);
        }
    }

    // Format timestamp
    const formatTimestamp = (timestamp?: string) => {
        if (!timestamp) return "Unknown time"
        const date = new Date(timestamp)
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
        if (diffInMinutes < 1) return "Just now"
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
        return `${Math.floor(diffInMinutes / 1440)}d ago`
    }

    // Check if notification is read
    const isNotificationRead = (notification: NotificationItem) => {
        return notification.read || notification.readBy?.includes(profileId) || false
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={handleDropdownOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full relative bg-background">
                    <Bell className="size-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs font-medium bg-blue-600 hover:bg-blue-700"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align={locale === "ar" ? "start" : "end"} className="w-screen max-xs:mx-auto xs:w-96 p-0 shadow-lg" sideOffset={8}>
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "received" | "invitations")} className="w-full ">
                    <div className="px-4 pt-2">
                        <TabsList className="grid w-full grid-cols-2 h-8">
                            <TabsTrigger value="received" className="text-xs">
                                Notifications ({unreadCount})
                            </TabsTrigger>
                            <TabsTrigger value="invitations" className="text-xs">
                                Invitations ({invitations.length})
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="received" className="mt-0">
                        <ScrollArea className="max-h-96 overflow-y-auto no-scrollbar">
                            <div className={`flex items-center justify-between p-2 border-b ${unreadCount === 0 && "hidden"} `}>
                                <div className="flex items-center gap-1">
                                    {unreadCount > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={markAllAsRead}
                                            className="h-7 px-2 text-xs text-azure hover:text-blue-700 hover:bg-blue-200"
                                        >
                                            <CheckCheck className="h-3 w-3 mr-1" />
                                            Mark all read
                                        </Button>
                                    )}
                                </div>
                            </div>
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Bell className="h-8 w-8 text-gray-300 mb-2" />
                                    <p className="text-sm text-gray-500 font-medium">No notifications</p>
                                    <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200 dark:divide-gray-900">
                                    {notifications.map((notification) => {
                                        const senderInfo = getSenderInfo(notification)
                                        const isRead = isNotificationRead(notification)

                                        return (
                                            <div
                                                key={notification._id}
                                                className={`p-2 transition-colors ${isRead ? "opacity-80" : ""}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <img
                                                        src={avatar.src}
                                                        alt={`${senderInfo.name}'s avatar`}
                                                        className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4
                                                                className={`text-sm font-medium truncate ${!isRead ? "text-primary" : "text-gray-600"}`}
                                                            >
                                                                {notification.title}
                                                            </h4>
                                                            {!isRead && <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0" />}
                                                        </div>
                                                        <p onClick={(e) => {
                                                            e.currentTarget.classList.toggle("line-clamp-2");
                                                        }}
                                                            className="text-xs text-gray-600 mb-2 line-clamp-2 cursor-pointer transition-all">{notification.body}</p>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        {!isRead && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => markAsRead(notification._id)}
                                                                className="h-8 w-8 p-0 text-gray-400 hover:text-azure hover:bg-blue-200"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-full flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-500">{senderInfo.name}</span>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <span className="text-xs text-gray-500">{formatTimestamp(notification.createdAt)}</span>
                                                    </div>
                                                    <Badge
                                                        variant="secondary"
                                                        className={`text-xs px-2 py-0.5 ${getNotificationTypeColor(notification.type)}`}
                                                    >
                                                        {notification.type?.replace("-", " ") || "notification"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        )
                                    })}

                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="invitations" className="mt-0">
                        <ScrollArea className="max-h-96 overflow-y-auto no-scrollbar">
                            {invitations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Bell className="h-8 w-8 text-gray-300 mb-2" />
                                    <p className="text-sm text-gray-500 font-medium">No invitations</p>
                                    <p className="text-xs text-gray-400 mt-1">Your invitations will appear here</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200 dark:divide-gray-900">
                                    {invitations.map((invitation) => {
                                        const senderInfo = getInvitationSenderInfo(invitation)

                                        return (
                                            <div key={invitation._id} className="p-2">
                                                <div className="flex items-start gap-3">
                                                    <img
                                                        src={avatar.src}
                                                        alt={`${senderInfo.name}'s avatar`}
                                                        className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="text-sm font-medium truncate text-primary">
                                                                Invitation from {senderInfo.name.split(" ")[0]}
                                                            </h4>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                                            {senderInfo.name} invited you to connect on SPINET.
                                                        </p>
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-gray-500">{senderInfo.name}</span>
                                                                <span className="text-xs text-gray-400">•</span>
                                                                <span className="text-xs text-gray-500">{formatTimestamp(invitation.date)}</span>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <Button size="sm" variant="destructive" onClick={() => handleRefuseInvitation(profileId, invitation._id)}>Decline</Button>
                                                                <Button size="sm" onClick={() => handleAcceptInvitation(profileId, invitation._id)}>Accept</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>

                {/* {(notifications.length > 0 || invitations.length > 0) && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="p-1 pt-0">
                            <Button
                                variant="ghost"
                                className="w-full text-sm text-azure hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                View all notifications
                            </Button>
                        </div>
                    </>
                )} */}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}