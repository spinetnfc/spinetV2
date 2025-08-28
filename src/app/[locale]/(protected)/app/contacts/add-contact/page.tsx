"use client"

import type React from "react"

import { ArrowLeft, Upload, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function AddContactPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [date, setDate] = useState<Date>()
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [displayText, setDisplayText] = useState("")
  const [url, setUrl] = useState("")

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-white border-b px-6 py-4">
        <div className="w-full flex items-center justify-between    ">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-medium">Add new contact</h1>
              <span className="text-sm text-blue-600">manual</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <QrCode className="h-4 w-4" />
              Scan
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      
        <div className=" py-8 px-16 ">
          {/* Profile Picture Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Profile picture</h3>
            <p className="text-sm text-gray-500 mb-4">This will be displayed on your contact's profile</p>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profileImage || undefined} />
                <AvatarFallback className="bg-gray-100">
                    <span className="text-2xl text-gray-400">+</span>
                </AvatarFallback>
              </Avatar>
              <div className="relative inline-flex items-center">
  <Button
    variant="outline"
    size="sm"
    className="flex items-center gap-2 bg-transparent pointer-events-none"
  >
    <Upload className="h-4 w-4" />
    Upload
  </Button>
  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="absolute inset-0 opacity-0 cursor-pointer"
  />
</div>

            </div>
          </div>

          {/* Form Content */}
          <div className="flex justify-between gap-24 items-center flex-col lg:flex-row">
            {/* Personal Information */}
            <div className="w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Personal information</h3>
              <div className="space-y-6">
                <div className="w-full flex flex-col  justify-between items-center lg:flex-row gap-4">
                <div className="w-full">
                  <Label htmlFor="fullName" className="text-sm font-medium text-primary">
                    Full name *
                  </Label>
                  <Input id="fullName" className="mt-1" />
                </div>

                <div className="w-full">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-primary">
                    Phone number
                  </Label>
                  <Input id="phoneNumber" className="mt-1" />
                </div>
</div>
                <div className="w-full flex flex-col  justify-between items-center lg:flex-row gap-4">

                <div className="w-full">
                  <Label htmlFor="companyName" className="text-sm font-medium text-primary">
                    Company name
                  </Label>
                  <Input id="companyName" className="mt-1" />
                </div>

                <div className="w-full">
                  <Label htmlFor="position" className="text-sm font-medium text-primary">
                    Position
                  </Label>
                  <Input id="position" className="mt-1" />
                </div>
</div>

                <div className="w-full">
                  <Label htmlFor="email" className="text-sm font-medium text-primary">
                    Email
                  </Label>
                  <Input id="email" type="email" className="mt-1" />
                </div>
              </div>
            </div>

            {/* Interaction Information */}
            <div className="w-1/3">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Interaction information</h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="metIn" className="text-sm font-medium text-primary">
                    Met in
                  </Label>
                  <Input id="metIn" placeholder="Mohammadia" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="nextAction" className="text-sm font-medium text-primary">
                    Next action
                  </Label>
                  <Input id="nextAction" placeholder="eg. follow up call" className="mt-1" />
                </div>

                <div>
                  <Label className="text-sm font-medium text-primary">Date of next action</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full mt-1 justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Notes</h4>
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 bg-transparent">
                    Add note
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Links</h3>

            {showLinkForm && (
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="displayText" className="text-sm font-medium text-primary">
                      Display text
                    </Label>
                    <Input
                      id="displayText"
                      placeholder="eg. LinkedIn"
                      value={displayText}
                      onChange={(e) => setDisplayText(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="url" className="text-sm font-medium text-primary">
                      Url
                    </Label>
                    <Input
                      id="url"
                      placeholder="https://"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <Button variant="ghost" size="sm" onClick={() => setShowLinkForm(false)}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      // Handle save logic here
                      setShowLinkForm(false)
                      setDisplayText("")
                      setUrl("")
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t">
            <Button variant="ghost">Cancel</Button>
            <div className="flex items-center gap-3">
              <Button variant="outline">Save and add new contact</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
            </div>
          </div>
        </div>
      </div>
   )
}
