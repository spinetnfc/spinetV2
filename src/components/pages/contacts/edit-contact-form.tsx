"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormattedMessage } from "react-intl"
import { useState } from "react"
import type { Contact } from "@/types/contact"

interface EditContactFormProps {
  contact: Contact
  onSuccess: () => void
  onCancel: () => void
}

export default function EditContactForm({ contact, onSuccess, onCancel }: EditContactFormProps) {
  const [formData, setFormData] = useState({
    fullName: contact.Profile.fullName || "",
    email: contact.Profile.links?.find((link) => link.title.toLowerCase() === "email")?.link || "",
     companyName: contact.Profile.companyName || "",
    position: contact.Profile.position || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    onSuccess()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="edit-contact" defaultMessage="Edit Contact" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">
              <FormattedMessage id="full-name" defaultMessage="Full Name" />
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="email">
              <FormattedMessage id="email" defaultMessage="Email" />
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          
          <div>
            <Label htmlFor="companyName">
              <FormattedMessage id="company" defaultMessage="Company" />
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="position">
              <FormattedMessage id="position" defaultMessage="Position" />
            </Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button type="submit" className="flex-1">
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
