"use client"

import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/bottom-drawer"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FormattedMessage } from "react-intl"
import { useEffect, useState } from "react"
import { CirclePlus } from "lucide-react"
import { useUser, useIsAuthenticated, useSelectProfile } from "@/lib/store/auth/auth-store"
import { useLocale } from "@/hooks/use-locale"
import { Spinner } from "./ui/spinner"
import { ProfileAvatar } from "./pages/profile/profile-avatar"
import { mockProfiles } from "@/mockdata/profiles"
import type { ProfileData } from "@/types/profile"


export default function SwitchProfileDrawer() {
    const user = useUser();
    const isAuthenticated = useIsAuthenticated();
    const selectProfile = useSelectProfile();
    const locale = useLocale();
    const [profiles, setProfiles] = useState<ProfileData[]>([])
    const [selectedProfile, setSelectedProfile] = useState<ProfileData | null>(null)
    const [showAlert, setShowAlert] = useState(false)

    useEffect(() => {
        if (isAuthenticated && user?._id) {
            // Use mock profiles
            const selectedIdx = mockProfiles.findIndex((p: ProfileData) => p._id === user.selectedProfile);
            if (selectedIdx > -1) {
                const selected = mockProfiles[selectedIdx];
                const remaining = mockProfiles.filter((_: ProfileData, idx: number) => idx !== selectedIdx);
                setProfiles([selected, ...remaining]);
            } else {
                setProfiles(mockProfiles);
            }
        }
    }, [user?._id, user?.selectedProfile, isAuthenticated])

    const handleProfileClick = (profile: ProfileData) => {
        if (user?.selectedProfile === profile._id) {
            return // Don't show alert if clicking on current profile
        }
        setSelectedProfile(profile)
        setShowAlert(true)
    }

    const handleConfirmSwitch = async () => {
        if (selectedProfile && user) {
            try {
                await selectProfile(selectedProfile._id!);
                setShowAlert(false);
            } catch (error) {
                console.error("Error switching profile:", error)
            }
        }
        setShowAlert(false)
        setSelectedProfile(null)
    }

    const handleCancelSwitch = () => {
        setShowAlert(false)
        setSelectedProfile(null)
    }

    return (
        <>
            <Drawer>
                <DrawerTrigger className="relative w-full flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50">
                    <FormattedMessage id="switch-profile" defaultMessage="Switch Profile" />
                </DrawerTrigger>
                <DrawerContent className="focus:outline-none max-sm:h-[80vh]">
                    <DrawerHeader>
                        <DrawerTitle>
                            <FormattedMessage id="my-profiles" defaultMessage="My Profiles" />
                        </DrawerTitle>
                    </DrawerHeader>
                    <DrawerFooter className="sm:justify-start p-0">
                        <ScrollArea className="w-full h-[72vh] sm:h-[280px]">
                            {profiles.length > 0 ? (
                                <div className="flex flex-col items-center sm:justify-center sm:flex-row pb-4">
                                    {profiles.map((profile) => (
                                        <div
                                            key={profile._id}
                                            className={`flex-shrink-0 h-60 w-60 flex flex-col items-center m-2 gap-4 p-3 rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer hover:opacity-70 transition-colors ${user.selectedProfile === profile._id ? "border-2 border-azure" : ""
                                                }`}
                                            onClick={() => { if (profile._id !== user?.selectedProfile) handleProfileClick(profile) }}
                                        >
                                            <div className="border-2  rounded-full">
                                                <ProfileAvatar profilePicture={profile.profilePicture} height={96} width={96} />
                                            </div>
                                            <div>
                                                <div className="font-semibold">{profile.fullName}</div>
                                                <div className="text-sm text-muted-foreground">{profile.companyName}</div>
                                                <div className="text-xs text-muted-foreground">{profile.position}</div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex-shrink-0 h-60 w-60 flex justify-center items-center m-2 rounded-lg border bg-card text-card-foreground shadow-sm hover:opacity-70 ">
                                        <button className="cursor-pointer flex flex-col items-center justify-center"
                                            onClick={() => {
                                                window.location.href = `/${locale}/app/profile/add-profile`
                                            }}>
                                            <CirclePlus className="h-24 w-24" strokeWidth={1} />
                                            <FormattedMessage id="add-profile" defaultMessage="Add Profile" />

                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center items-center h-full">
                                    <Spinner className="text-primary" size="xl" />
                                </div>
                            )}
                            <ScrollBar orientation="horizontal" className="sm:visible h-4" />
                        </ScrollArea>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <FormattedMessage id="confirm-profile-switch" defaultMessage="Confirm Profile Switch" />
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            <FormattedMessage
                                id="profile-switch-confirmation"
                                defaultMessage="Are you sure you want to switch to this profile? This will reload the page to apply the changes."
                                values={{
                                    profileName: selectedProfile?.fullName,
                                }}
                            />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelSwitch}>
                            <FormattedMessage id="cancel" defaultMessage="Cancel" />
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmSwitch}>
                            <FormattedMessage id="confirm" defaultMessage="Confirm" />
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
