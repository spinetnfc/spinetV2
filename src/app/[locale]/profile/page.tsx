import Image from "next/image"
import { Linkedin, Globe, Phone, UserPlus, Send } from "lucide-react"
import Link from "next/link"
import PlayStoreIcon from "@/components/icons/play-store"
import AppStoreIcon from "@/components/icons/app-store"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
    return (
        <>
            {/* Profile Image */}
            <div className="relative w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 mx-auto -top-16 xs:-top-20 sm:-top-24 bg-neutral-50 rounded-full">
                <Image
                    src="/img/user.png"
                    alt="Profile picture "
                    fill
                    className="rounded-full object-cover border-4 border-neutral-50"
                />
                <div className="absolute -bottom-2 left-20 bg-neutral-50 border border-gray-300 h-8 w-8 flex items-cenyer justify-center rounded-md">
                    <Image src="/img/spinet-logo.svg" alt="company logo" width={24} height={24} className="rounded-full bg-white" />
                </div>
            </div>
            <div className="sm:container mx-auto px-4 -mt-16 mb-8">
                <div className="max-w-md mx-auto sm:bg-neutral-50 sm:dark:bg-navy rounded-3xl sm:shadow-xl overflow-hidden">
                    <div className="flex flex-col items-center sm:pt-8 pb-6">


                        {/* Name and Title */}
                        <h1 className="text-xl font-bold">Abderrahmane Bakdi</h1>
                        <p className="text-sm text-gray-500">CTO at SPINET</p>

                        {/* Contact Buttons */}
                        <div className="w-full px-6 mt-6 space-y-3">
                            <Link
                                href="#"
                                className="flex items-center w-full p-3 bg-blue-50 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                <Linkedin className="w-5 h-5 text-azure" />
                                <span className="ml-3 font-medium text-gray-700">Linkedin</span>
                            </Link>

                            <Link
                                href="#"
                                className="flex items-center w-full p-3 bg-blue-50 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                <Globe className="w-5 h-5 text-azure" />
                                <span className="ml-3 font-medium text-gray-700">Website</span>
                            </Link>

                            <Link
                                href="tel:+213770957427"
                                className="flex items-center w-full p-3 bg-blue-50 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                <Phone className="w-5 h-5 text-azure" />
                                <span className="ml-3 font-medium text-gray-700">+213770957427</span>
                            </Link>

                            <Link
                                href="tel:+213770957427"
                                className="flex items-center w-full p-3 bg-blue-50 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                <Phone className="w-5 h-5 text-azure" />
                                <span className="ml-3 font-medium text-gray-700">+213770957427</span>
                            </Link>
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full px-6 mt-6 grid grid-cols-2 gap-3">
                            <button className="border-2 border-azure hover:opacity-80 text-azure text-lg font-medium w-fit xs:w-full mx-auto flex items-center justify-center gap-1 px-2 xs:px-0 py-2 rounded-xl xs:rounded-md cursor-pointer">
                                <UserPlus className="h-8 w-8 xs:h-5 xs:w-5" />
                                <span className="hidden xs:inline-block text-sm sm:text-base whitespace-nowrap">Ajouter contact</span>
                            </button>
                            <button className="bg-azure hover:bg-azure/70 text-white text-lg font-medium w-fit xs:w-full mx-auto flex items-center justify-center gap-1 px-2 xs:px-0 py-2 rounded-xl xs:rounded-md cursor-pointer">
                                <Send className="h-8 w-8 xs:h-5 xs:w-5" />
                                <span className="hidden xs:inline-block text-sm sm:text-base whitespace-nowrap">Envoyer message</span>
                            </button>
                        </div>

                        <div className="flex-col justify-center items-center mt-6">
                            <h2 className="text-center text-2xl font-semibold">Download App</h2>
                            <div className="flex flex-col xs:flex-row gap-2 xs:gap-10 mt-4">
                                <Link href="https://play.google.com/store/apps/details?id=com.spinet.spinetnfc&hl=en" className="flex items-center gap-1 text-azure font-medium">
                                    <PlayStoreIcon className="w-8 h-8" />
                                    From Play Store
                                </Link>
                                <Link href="https://apps.apple.com/fr/app/spinet-nfc/id1606369890" className="flex items-center gap-1 text-azure font-medium">
                                    <AppStoreIcon className="w-8 h-8" />
                                    From App Store
                                </Link>
                            </div>
                        </div>

                        {/* Bottom Padding */}
                        <div className="h-6" />
                    </div>
                </div>
            </div>
        </>
    )
}

