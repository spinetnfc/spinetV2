"use client"

import { useState, useEffect } from "react"
import { Bell, Check, CheckCheck, Settings, User, Building2 } from "lucide-react"
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

export type NotificationItem = {
    id: string
    Company?: string
    Invitation?: string
    type?: "message" | "invitation" | "system-automated" | "system-manual"
    title: string
    body: string
    image?: string
    from: string
    to: string[]
    fromType: "admin" | "profile" | "company" | "system"
    toType?: "admin" | "profile"
    readBy?: string[]
    deletedBySender?: boolean
    deletedByReceivers?: string[]
    createdAt?: string
    updatedAt?: string
    Sender?: {
        _id: string
        fullName?: string
        firstName?: string
        lastName?: string
        name?: string
        subdomain?: string
        size?: string
        description?: string
        website?: string
        logo?: string
    }
    read?: boolean
}

interface NotificationDropdownProps {
    pollingInterval?: number
}

// Mock data array
const MOCK_NOTIFICATIONS: NotificationItem[] = [
    {
        id: "1",
        title: "New Contact Request",
        body: "John Doe wants to connect with you on SPINET",
        type: "invitation",
        from: "user123",
        to: ["current-user"],
        fromType: "profile",
        createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
        read: false,
        Sender: {
            _id: "user123",
            fullName: "John Doe",
            firstName: "John",
            lastName: "Doe",
            logo: "/placeholder.svg?height=32&width=32",
        },
    },
    {
        id: "2",
        title: "System Update Available",
        body: "SPINET has been updated to version 2.1.0 with new features and improvements",
        type: "system-automated",
        from: "system",
        to: ["current-user"],
        fromType: "system",
        createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
        read: false,
    },
    {
        id: "3",
        title: "Profile Incomplete",
        body: "Complete your profile to unlock all SPINET features and improve your visibility",
        type: "system-manual",
        from: "admin",
        to: ["current-user"],
        fromType: "admin",
        createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
        read: true,
        readBy: ["current-user"],
    },
    {
        id: "4",
        title: "New Message from Sarah",
        body: "Hi! I saw your profile and would love to discuss potential collaboration opportunities.",
        type: "message",
        from: "user456",
        to: ["current-user"],
        fromType: "profile",
        createdAt: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
        read: true,
        readBy: ["current-user"],
        Sender: {
            _id: "user456",
            fullName: "Sarah Wilson",
            firstName: "Sarah",
            lastName: "Wilson",
            logo: "/placeholder.svg?height=32&width=32",
        },
    },
    {
        id: "5",
        title: "Welcome to SPINET",
        body: "Thank you for joining SPINET! Get started by completing your profile and adding your first contact.",
        type: "system-manual",
        from: "admin",
        to: ["current-user"],
        fromType: "admin",
        createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
        read: true,
        readBy: ["current-user"],
    },
]

export default function NotificationDropdown({ pollingInterval = 30000 }: NotificationDropdownProps) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [activeTab, setActiveTab] = useState<"received" | "sent">("received")
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAuth();
    const profileId = user.selectedProfile;
    // Simulate fetching notifications from API
    const fetchNotifications = async () => {
        setIsLoading(true)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        try {
            // In a real app, this would be an API call
            // const response = await fetch('/api/notifications')
            // const data = await response.json()

            // For now, we'll use mock data with some randomization
            const mockData = [...MOCK_NOTIFICATIONS]

            // Randomly add a new notification sometimes
            if (Math.random() > 0.7) {
                const newNotification: NotificationItem = {
                    id: Date.now().toString(),
                    title: "New Activity",
                    body: `You have new activity on SPINET - ${new Date().toLocaleTimeString()}`,
                    type: "system-automated",
                    from: "system",
                    to: [profileId],
                    fromType: "system",
                    createdAt: new Date().toISOString(),
                    read: false,
                }
                mockData.unshift(newNotification)
            }

            setNotifications(mockData)

            // Calculate unread count
            const unread = mockData.filter((n) => !n.read && !n.readBy?.includes(profileId))
            setUnreadCount(unread.length)
        } catch (error) {
            console.error("Failed to fetch notifications:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Periodic fetching with useEffect
    useEffect(() => {
        // Initial fetch
        fetchNotifications()

        // Set up polling
        const interval = setInterval(fetchNotifications, pollingInterval)

        // Cleanup
        return () => clearInterval(interval)
    }, [profileId, pollingInterval])

    // Mark notification as read
    const markAsRead = (notificationId: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, read: true, readBy: [...(n.readBy || []), profileId] } : n)),
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
    }

    // Mark all notifications as read
    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((n) => ({
                ...n,
                read: true,
                readBy: [...(n.readBy || []), profileId],
            })),
        )
        setUnreadCount(0)
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

    // Get sender display info
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

    // Filter notifications (for demo, we'll show all as "received")
    const receivedNotifications = notifications
    const sentNotifications: NotificationItem[] = []

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full relative bg-white dark:bg-background">
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

            <DropdownMenuContent align="end" className="w-96 p-0 shadow-lg" sideOffset={8}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <DropdownMenuLabel className="p-0 font-semibold text-gray-600">Notifications</DropdownMenuLabel>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                {unreadCount} new
                            </Badge>
                        )}
                        {isLoading && <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" />}
                    </div>

                    <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={markAllAsRead}
                                className="h-7 px-2 text-xs text-azure hover:text-blue-700 hover:bg-blue-50"
                            >
                                <CheckCheck className="h-3 w-3 mr-1" />
                                Mark all read
                            </Button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as "received" | "sent")}
                    className="w-full"
                >
                    <div className="px-4 pt-2">
                        <TabsList className="grid w-full grid-cols-2 h-8">
                            <TabsTrigger value="received" className="text-xs">
                                Received ({receivedNotifications.length})
                            </TabsTrigger>
                            <TabsTrigger value="sent" className="text-xs">
                                Sent ({sentNotifications.length})
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="received" className="mt-0">
                        <ScrollArea className="max-h-96  overflow-y-auto no-scrollbar">
                            {receivedNotifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Bell className="h-8 w-8 text-gray-300 mb-2" />
                                    <p className="text-sm text-gray-500 font-medium">No notifications</p>
                                    <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200 dark:divide-gray-900">
                                    {receivedNotifications.map((notification) => {
                                        const senderInfo = getSenderInfo(notification)
                                        const isRead = isNotificationRead(notification)

                                        return (
                                            <div
                                                key={notification.id}
                                                className={`p-4 hover:bg-gray-50 transition-colors ${isRead ? "opacity-80" : ""}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <img src="@/assets/images/user.png" />

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4
                                                                className={`text-sm font-medium truncate ${!isRead ? "text-primary" : "text-gray-600"}`}
                                                            >
                                                                {notification.title}
                                                            </h4>
                                                            {!isRead && <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0" />}
                                                        </div>

                                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{notification.body}</p>

                                                        <div className="flex items-center justify-between">
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

                                                    <div className="flex flex-col gap-1">
                                                        {!isRead && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="h-8 w-8 p-0 text-gray-400 hover:text-azure hover:bg-blue-200"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="sent" className="mt-0">
                        <ScrollArea className="max-h-96">
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Bell className="h-8 w-8 text-gray-300 mb-2" />
                                <p className="text-sm text-gray-500 font-medium">No sent notifications</p>
                                <p className="text-xs text-gray-400 mt-1">Your sent messages will appear here</p>
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>

                {/* Footer */}
                {receivedNotifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="p-3">
                            <Button
                                variant="ghost"
                                className="w-full text-sm text-azure hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => setIsOpen(false)}
                            >
                                View all notifications
                            </Button>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu >
    )
}
