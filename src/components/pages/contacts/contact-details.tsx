"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { X, Mail, UserPlus, Download, MoreHorizontal, Phone, MapPin, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Contact } from "@/types/contact"
import { Badge } from "@/components/ui/badge"
import { RenderIcon } from "@/components/ui/renderIcon"

interface ContactSidebarProps {
  contact: Contact
  onClose: () => void
}

const PhoneMockup: React.FC<ContactSidebarProps> = ({ contact, onClose }) => {
  if (!contact) return null

  return (
    <div className={cn("h-full w-80 bg-white border border-gray-200 z-50 overflow-y-auto")}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 ">
        <div className="flex items-center gap-2"></div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Profile Section */}
      <div className="p-4 text-center">
        <Avatar className="w-16 h-16 mx-auto mb-4">
          <AvatarImage src={contact.Profile.profileCover } alt={contact.Profile.firstName} />
          <AvatarFallback>
            {contact.Profile.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <h2 className="text-lg font-semibold text-gray-900 mb-1">{contact.Profile.fullName}</h2>

        <p className="text-sm text-gray-600 mb-4">
          {contact.Profile.position} at {contact.Profile.companyName}
        </p>

       {/* { <Badge className="bg-blue-200 text-blue-600 py-2 px-4 rounded-full text-xs">
          <Phone className="w-4 h-4 mr-2" />
          Phone contact
        </Badge>} */}

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
            <Button variant="ghost" size="sm" className="p-2">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            <span className="text-xs text-gray-600">more</span>
          </div>
        </div>

        {/* Last Activity */}
        {/* { <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Last activity: {contact.Profile.}
        </div>
      </div>} */}

        {/* contact.Profile. Information */}
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
              <p className="text-sm text-primary">
                {contact.Profile.links?.filter((link) => link.title === "Email").map((link) => link.link)}
              </p>
            </div>

            {/* Phone */}
            <div className="flex flex-col items-start gap-2">
              <div className="flex gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-medium text-gray-400">Phone</p>
              </div>
              <p className="text-sm text-primary">
                {contact.Profile.links?.filter((link) => link.title === "phone").map((link) => link.link)}
              </p>
            </div>

            {/* Owner */}
            {/* { <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
              <span className="text-xs text-white font-bold">OD</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Owner</p>
              <p className="text-sm text-blue-600">{contact.Profile.owner}</p>
              <p className="text-xs text-gray-500">{contact.Profile.ownerRole}</p>
            </div>
          </div>} */}

            {/* Location */}
            <div className="flex flex-col items-start gap-2">
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-medium text-gray-400">Met in</p>
              </div>
              <p className="text-sm text-primary">{contact.Profile.position}</p>
            </div>

            {/* Score */}
            {/* { <div className="pt-2">
            <p className="text-sm font-medium text-gray-900 mb-1">Score</p>
            <p className="text-2xl font-bold text-gray-900">{contact.Profile.score}</p>
          </div>} */}
          </div>
        </div>

        {/* Personal Links */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Personal links</h3>
            
          </div>

          <div className="space-y-3">
            
            {contact.Profile.links?.map((link: any, index: number) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => window.open(link.link, "_blank")}
              >
                <RenderIcon iconType={link.name || link.title} className="" />
                <div className="ml-3 flex flex-col min-w-0 justify-start">
                  <p className="text-sm font-medium text-gray-900 truncate text-left">{link.title}</p>
                  <p className="text-xs text-gray-500 truncate">{link.link}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhoneMockup
