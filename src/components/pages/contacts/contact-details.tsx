"use client"

import type React from "react"
import { useState } from "react"
import { cn } from '@/utils/cn'
import { X, Mail, UserPlus, Download, MoreHorizontal, Phone, MapPin, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Contact, ContactInput } from "@/types/contact"
import { RenderIcon } from "@/components/ui/renderIcon"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Input } from "@/components/ui/input"
import { format } from "date-fns";
import { FormattedMessage, useIntl } from "react-intl"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useUser } from "@/store/auth-store"

interface ContactSidebarProps {
  contact: Contact
  onClose: () => void
}

const PhoneMockup: React.FC<ContactSidebarProps> = ({ contact, onClose }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editedContact, setEditedContact] = useState<Contact>({
    ...contact,
    Profile: {
      ...contact.Profile,
      position: contact.Profile?.position || "",
      companyName: contact.Profile?.companyName || "",
      links: contact.Profile?.links || [],
    },
    leadCaptions: {
      ...contact.leadCaptions,
      tags: contact.leadCaptions?.tags || [],
    },
  })
  const intl = useIntl()
  const router = useRouter()
  const user = useUser();
  const profileId = user.selectedProfile;
  if (!contact) return null

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    setIsEditing(false);
    try {
      // normalize links
      const formLinks = (editedContact.Profile.links || []).map(({ title, link }) => ({
        title,
        link,
      }));

      const ContactInfo: ContactInput = {
        name: editedContact.Profile.fullName,
        type: contact.type,
        profile: {
          fullName: editedContact.Profile.fullName,
          position: editedContact.Profile.position || undefined,
          companyName: editedContact.Profile.companyName || undefined,
          profilePicture: contact.Profile?.profilePicture,
          links: formLinks.length > 0 ? formLinks : undefined, // <-- clean links
        },
        leadCaptions: {
          metIn: editedContact.leadCaptions?.metIn || undefined,
          date: editedContact.leadCaptions?.date || new Date().toISOString(),
          tags: editedContact.leadCaptions?.tags?.length ? editedContact.leadCaptions.tags : undefined,
          nextAction: editedContact.leadCaptions?.nextAction || undefined,
          dateOfNextAction: editedContact.leadCaptions?.dateOfNextAction
            ? format(editedContact.leadCaptions.dateOfNextAction, "yyyy-MM-dd")
            : undefined,
          notes: editedContact.leadCaptions?.notes || undefined,
        },
      };

      // Mock edit contact - replace with hardcoded behavior
      console.log("Mock edit contact:", profileId, editedContact._id, ContactInfo);
      toast.success(intl.formatMessage({ id: "Contact saved successfully" }))
    } catch (error) {
      console.error("Error saving contact:", error)
      toast.error(
        intl.formatMessage({
          id: "Failed to save contact. Please try again.",
        })
      )
    } finally {
      setIsEditing(false)
      setEditedContact(contact) // Reset to original
      router.refresh()

    }
  };


  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedContact(contact) // Reset to original

  }

  const handleDeleteConfirm = async () => {
    if (!profileId) return

    try {
      console.log("Deleting contact with ID:", contact._id)
      console.log("Deleting contact from contact.Profile._id:", profileId)
      // Mock remove contact - replace with hardcoded behavior
      console.log("Mock remove contact:", profileId, contact._id);
      toast.success(intl.formatMessage({ id: "Contact deleted successfully" }))
      router.refresh()
    } catch (error) {
      console.error("Error deleting contact:", error)
      toast.error(intl.formatMessage({ id: "Failed to delete contact. Please try again." }))
    } finally {
      setShowDeleteDialog(false)
    }
  }

  const updateContactField = (field: string, value: string) => {
    setEditedContact({
      ...editedContact,
      Profile: { ...editedContact.Profile, [field]: value },
    })
  }

  const updateLinkField = (index: number, field: string, value: string) => {
    const updatedLinks = [...(editedContact.Profile.links || [])]
    updatedLinks[index] = { ...updatedLinks[index], [field]: value }
    setEditedContact({
      ...editedContact,
      Profile: { ...editedContact.Profile, links: updatedLinks },
    })
  }

  const addNewLink = () => {
    const newLink = { title: "New Link", link: "https://", name: "link" }
    setEditedContact({
      ...editedContact,
      Profile: {
        ...editedContact.Profile,
        links: [...(editedContact.Profile.links || []), newLink],
      },
    })
  }

  const removeLink = (index: number) => {
    const updatedLinks = editedContact.Profile.links?.filter((_, i) => i !== index) || []
    setEditedContact({
      ...editedContact,
      Profile: { ...editedContact.Profile, links: updatedLinks },
    })
  }

  return (
    <div className={cn("h-full w-80 bg-white border border-gray-200 z-50 overflow-y-auto")}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 ">
        <div className="flex items-center gap-2">
          {isEditing && (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Profile Section */}
      <div className="px-4   text-center">
        <Avatar className="w-16 h-16 mx-auto mb-4">
          <AvatarImage src={contact.Profile.profilePicture || "/placeholder.svg"} alt={contact.Profile.firstName} />
          <AvatarFallback>
            {contact.Profile.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        {isEditing ? (
          <div className="space-y-2 mb-4">
            <Input
              value={editedContact.Profile.fullName}
              onChange={(e) => updateContactField("fullName", e.target.value)}
              className="text-center"
              placeholder="Full Name"
            />
            <Input
              value={editedContact.Profile.position}
              onChange={(e) => updateContactField("position", e.target.value)}
              className="text-center text-sm"
              placeholder="Position"
            />
            <Input
              value={editedContact.Profile.companyName || ""}
              onChange={(e) => updateContactField("companyName", e.target.value)}
              className="text-center text-sm"
              placeholder="Company Name"
            />
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{contact.Profile.fullName}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {contact.Profile.position} at {contact.Profile.companyName}
            </p>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 my-4">
          <div className="flex flex-col items-start">
            <Button variant="ghost" size="sm" className="p-2">
              <Mail className="w-4 h-4" />
            </Button>
            <span className="text-xs text-gray-600">Email</span>
          </div>
          <div className="flex flex-col items-center">
            <Button variant="ghost" size="sm" className="p-2">
              <UserPlus className="w-4 h-4" />
            </Button>
            <span className="text-xs text-gray-600">create lead</span>
          </div>
          <div className="flex flex-col items-center">
            <Button variant="ghost" size="sm" className="p-2">
              <Download className="w-4 h-4" />
            </Button>
            <span className="text-xs text-gray-600">export</span>
          </div>
          <div className="flex flex-col items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600 focus:text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-xs text-gray-600">more</span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Contact Information</h3>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex flex-col items-start gap-2">
              <div className="flex gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-medium text-gray-400">Email</p>
              </div>
              {isEditing ? (
                <Input
                  value={editedContact.Profile.links?.find((link) => link.title === "Email")?.link || ""}
                  onChange={(e) => {
                    const emailIndex = editedContact.Profile.links?.findIndex((link) => link.title === "Email") ?? -1
                    if (emailIndex >= 0) {
                      updateLinkField(emailIndex, "link", e.target.value)
                    }
                  }}
                  placeholder="Email address"
                  className="text-sm"
                />
              ) : (
                <p className="text-sm text-primary">
                  {contact.Profile.links?.filter((link) => link.title === "Email").map((link) => link.link)}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col items-start gap-2">
              <div className="flex gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-medium text-gray-400">Phone</p>
              </div>
              {isEditing ? (
                <Input
                  value={editedContact.Profile.links?.find((link) => link.title === "phone")?.link || ""}
                  onChange={(e) => {
                    const phoneIndex = editedContact.Profile.links?.findIndex((link) => link.title === "phone") ?? -1
                    if (phoneIndex >= 0) {
                      updateLinkField(phoneIndex, "link", e.target.value)
                    }
                  }}
                  placeholder="Phone number"
                  className="text-sm"
                />
              ) : (
                <p className="text-sm text-primary">
                  {contact.Profile.links?.filter((link) => link.title === "phone").map((link) => link.link)}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="flex flex-col items-start gap-2">
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-medium text-gray-400">Met in</p>

              </div>
              {isEditing ? (
                <Input
                  value={editedContact.Profile.position}
                  onChange={(e) => updateContactField("position", e.target.value)}
                  placeholder="Location"
                  className="text-sm"
                />
              ) : (
                <p className="text-sm text-primary">{contact.leadCaptions?.metIn}</p>
              )}
            </div>
          </div>
        </div>

        {/* Personal Links */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Personal links</h3>
            {isEditing && (
              <Button size="sm" variant="outline" onClick={addNewLink}>
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {editedContact.Profile.links?.map((link: any, index: number) => (
              <div key={index} className="space-y-2">
                {isEditing ? (
                  <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        value={link.title}
                        onChange={(e) => updateLinkField(index, "title", e.target.value)}
                        placeholder="Link title"
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeLink(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      value={link.link}
                      onChange={(e) => updateLinkField(index, "link", e.target.value)}
                      placeholder="URL"
                      className="text-sm"
                    />
                  </div>
                ) : (
                  <div
                    className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => window.open(link.link, "_blank")}
                  >
                    <RenderIcon iconType={link.name || link.title} className="" />
                    <div className="ml-3 flex flex-col min-w-0 justify-start">
                      <p className="text-sm font-medium text-gray-900 truncate text-left">{link.title}</p>
                      <p className="text-xs text-gray-500 truncate">{link.link}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              <FormattedMessage
                id="delete.confirm"
                defaultMessage="Are you sure you want to delete this? This action cannot be undone."
                values={{ itemName: contact.Profile.fullName }}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>            <FormattedMessage id="cancel" />
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              <FormattedMessage id="delete" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default PhoneMockup
