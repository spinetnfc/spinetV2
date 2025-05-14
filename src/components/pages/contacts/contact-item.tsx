import { Edit, MoreVertical, Trash2 } from "lucide-react"
import ContactAvatar from "./contact-avatar"
import type { Contact, ContactInput } from "@/types/contact"
import { getUserCookieOnServer } from "@/utils/cookies"
import { deleteContact, updateContact } from "@/lib/api/contacts"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"


type ContactItemProps = {
    contact: Contact
    themeColor: string
}

export default async function ContactItem({ contact, themeColor }: ContactItemProps) {
    const name = contact.name
    const Profile = contact.Profile ?? {}
    const user = await getUserCookieOnServer();
    const profileId = user?.selectedProfile || null; const position = Profile.position?.trim()
    const companyName = Profile.companyName?.trim()
    const hasPositionOrCompany = Boolean(position || companyName)

    const removeContact = async () => {
        "use server"
        if (!profileId) {
            return { success: false, message: "Profile ID is missing" };
        }
        try {
            // Implement the logic to remove the contact
            console.log("Removing contact:", contact._id)
            const response = await deleteContact(profileId, contact._id)
            return { success: true, message: response.message }
        } catch (error) {
            console.error("Error removing contact:", error)
            return { success: false, message: "Error removing contact" }
        }
    }
    const editContact = async (updatedContact: ContactInput) => {
        "use server"
        if (!profileId) {
            return { success: false, message: "Profile ID is missing" };
        }
        try {
            console.log("Removing contact:", contact._id,)
            const response = await updateContact(profileId, contact._id, updatedContact)
            return { success: true, message: response.message }
        } catch (error) {
            console.error("Error removing contact:", error)
            return { success: false, message: "Error removing contact" }
        }
    }

    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <ContactAvatar
                    name={name}
                    profilePicture={Profile.profilePicture ?? ""}
                    color={themeColor}
                />
                <div>
                    <h3 className="font-medium">{name}</h3>
                    {hasPositionOrCompany && (
                        <p className="text-sm text-gray-500">
                            {position}
                            {position && companyName && " "}
                            {companyName}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="absolute end-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="text-primary p-1 hover:text-gray-600 rounded-full cursor-pointer">
                                <MoreVertical size={20} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="bg-white dark:bg-background">
                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    // setShowEditForm(true)
                                }}
                            >
                                <Edit size={14} /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex items-center gap-2 text-red-500 cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    // handleDeleteClick()
                                }}
                            >
                                <Trash2 size={14} /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
    return (
        <>
            {/* {showDeleteModal && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    itemName={link.name}
                    isDeleting={isDeleting}
                />
            )}

            {isClickableLink ? (
                <Link href={link.link || "#"} target="_blank" rel="noopener noreferrer" className="block w-full">
                    {getLinkContent()}
                </Link>
            ) : (
                <div className="w-full">{getLinkContent()}</div>
            )} */}
        </>
    )
}
