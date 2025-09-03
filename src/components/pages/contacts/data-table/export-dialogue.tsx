"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { Contact } from "@/types/contact"

interface ExportDialogueProps {
  isOpen: boolean
  onClose: () => void
  contacts: Contact[]
}

export function ExportDialogue({ isOpen, onClose, contacts }: ExportDialogueProps) {
  const [selectedFields, setSelectedFields] = useState({
    name: true,
    role: true,
    score: true,
    emailAddress: true,
    company: true,
    source: true,
    phone: true,
    profilePictureLink: false,
    owner: false,
  })

  const [exportName, setExportName] = useState("All contacts")
  const [fileFormat, setFileFormat] = useState("CSV")

  const handleFieldChange = (field: string, checked: boolean) => {
    setSelectedFields((prev) => ({
      ...prev,
      [field]: checked,
    }))
  }

  const handleExport = () => {
    if (contacts.length === 0) {
      alert("No contacts to export.")
      return
    }

    const selectedFieldKeys = Object.entries(selectedFields)
      .filter(([_, selected]) => selected)
      .map(([field, _]) => field)

    if (selectedFieldKeys.length === 0) {
      alert("Please select at least one field to export.")
      return
    }

    const headers = selectedFieldKeys
    const rows = contacts.map((contact) =>
      headers
        .map((field) => {
          switch (field) {
            case "name":
              return  contact.Profile?.fullName || ""
            // case "role":
            //   return  contact.Profile?.role || ""
            // case "score":
            //   return  contact.Profile?.score || ""
            case "emailAddress":
              return  contact.Profile?.links?.filter((link) => link.title === "Email")[0]?.link || ""
            case "company":
              return  contact.Profile?.companyName || ""
            // case "source":
            //   return  contact.Profile?.source || ""
            case "phone":
              return  contact.Profile?.links?.filter((link) => link.title === "phone")[0]?.link || ""
            case "profilePictureLink":
              return  contact.Profile?.profilePicture || ""
            // case "owner":
            //   return  contact.Profile?.owner || ""
            default:
              return ""
          }
        })
        .join(","),
    )

    const csvContent = [headers.join(","), ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `${exportName.toLowerCase().replace(/\s+/g, "-")}.${fileFormat.toLowerCase()}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Export</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Export your contacts in CSV format, Click Download to save them as a file
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="exportName" className="text-sm font-medium mb-2 block">
                Export name
              </Label>
              <Input
                id="exportName"
                value={exportName}
                onChange={(e) => setExportName(e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="fileFormat" className="text-sm font-medium mb-2 block">
                File format
              </Label>
              <Select value={fileFormat} onValueChange={setFileFormat}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSV">CSV</SelectItem>
                  <SelectItem value="JSON">JSON</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">Select properties to export</h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="name" className="text-sm">
                  Name
                </Label>
                <Switch
                  id="name"
                  checked={selectedFields.name}
                  onCheckedChange={(checked) => handleFieldChange("name", checked)}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="emailAddress" className="text-sm">
                  Email address
                </Label>
                <Switch
                  id="emailAddress"
                  checked={selectedFields.emailAddress}
                  onCheckedChange={(checked) => handleFieldChange("emailAddress", checked)}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="phone" className="text-sm">
                  Phone
                </Label>
                <Switch
                  id="phone"
                  checked={selectedFields.phone}
                  onCheckedChange={(checked) => handleFieldChange("phone", checked)}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="role" className="text-sm">
                  Role
                </Label>
                <Switch
                  id="role"
                  checked={selectedFields.role}
                  onCheckedChange={(checked) => handleFieldChange("role", checked)}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="company" className="text-sm">
                  Company
                </Label>
                <Switch
                  id="company"
                  checked={selectedFields.company}
                  onCheckedChange={(checked) => handleFieldChange("company", checked)}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="profilePictureLink" className="text-sm">
                  Profile picture link
                </Label>
                <Switch
                  id="profilePictureLink"
                  checked={selectedFields.profilePictureLink}
                  onCheckedChange={(checked) => handleFieldChange("profilePictureLink", checked)}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="score" className="text-sm">
                  Score
                </Label>
                <Switch
                  id="score"
                  checked={selectedFields.score}
                  onCheckedChange={(checked) => handleFieldChange("score", checked)}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="source" className="text-sm">
                  Source
                </Label>
                <Switch
                  id="source"
                  checked={selectedFields.source}
                  onCheckedChange={(checked) => handleFieldChange("source", checked)}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="owner" className="text-sm">
                  Owner
                </Label>
                <Switch
                  id="owner"
                  checked={selectedFields.owner}
                  onCheckedChange={(checked) => handleFieldChange("owner", checked)}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center pt-6">
          <Button variant="ghost" onClick={onClose} className="text-sm">
            Cancel
          </Button>
          <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-sm px-6">
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
