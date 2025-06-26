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
import { getAllProfilesAction, switchProfile } from "@/actions/profile"
import { FormattedMessage } from "react-intl"
import { getUserFromCookie } from "@/utils/cookie"
import { startTransition, useEffect, useState } from "react"
import { CirclePlus, Loader } from "lucide-react"
import Image from "next/image"
import { getLocale } from "@/utils/getClientLocale"
import { useAuth } from "@/context/authContext"


export default function SwitchProfileDrawer() {
    const user = getUserFromCookie()
    const locale = getLocale() || "en";
    const [profiles, setProfiles] = useState<any[]>([])
    const [selectedProfile, setSelectedProfile] = useState<any>(null)
    const [showAlert, setShowAlert] = useState(false)
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        if (isAuthenticated) {
            startTransition(async () => {
                const result = await getAllProfilesAction(user._id);
                // Move the selected profile to the front, keep others in order
                const selectedIdx = result.findIndex(p => p._id === user.selectedProfile);
                if (selectedIdx > -1) {
                    const [selected] = result.splice(selectedIdx, 1);
                    setProfiles([selected, ...result]);
                } else {
                    setProfiles(result);
                }
            })
        }
    }, [user._id])

    const handleProfileClick = (profile: any) => {
        if (user.selectedProfile === profile._id) {
            return // Don't show alert if clicking on current profile
        }
        setSelectedProfile(profile)
        setShowAlert(true)
    }

    const handleConfirmSwitch = () => {
        if (selectedProfile) {
            try {
                switchProfile(user._id, selectedProfile._id)
                document.cookie = `current-user=${encodeURIComponent(JSON.stringify({ ...user, selectedProfile: selectedProfile._id }))}; path=/`
                window.location.reload() // Reload to apply the new profile
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
                                            onClick={() => { if (profile._id !== user.selectedProfile) handleProfileClick(profile) }}
                                        >
                                            <Image
                                                src="/img/user.png"
                                                alt="profile image"
                                                className="w-24 h-24 rounded-full"
                                                width={60}
                                                height={60}
                                            />
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
                                    <Loader className="animate-spin" />
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
