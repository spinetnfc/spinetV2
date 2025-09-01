"use client"

import type React from "react"

import { ArrowLeft, Upload, QrCode, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X } from "lucide-react"
import { useRef, useState } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import z from "zod"
import { toast } from "sonner"
import { FormattedMessage, useIntl } from "react-intl"
import { useAuth } from "@/context/authContext"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getLocale } from "@/utils/getClientLocale"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { createContact } from "@/actions/contacts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import ImportContacts from "@/components/pages/contacts/import-contacts"
import ScanContact from "@/components/pages/contacts/scan-contact"

export const ImportIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.66699 14.6668H12.0003C12.3539 14.6668 12.6931 14.5264 12.9431 14.2763C13.1932 14.0263 13.3337 13.6871 13.3337 13.3335V5.00016L9.66699 1.3335H4.00033C3.6467 1.3335 3.30756 1.47397 3.05752 1.72402C2.80747 1.97407 2.66699 2.31321 2.66699 2.66683V5.3335"
        stroke="#334155"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33301 1.3335V5.3335H13.333"
        stroke="#334155"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1.33301 10H7.99967" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M3.33301 8L1.33301 10L3.33301 12"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
export const GoogleIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.06641 1.8335C9.44767 1.8335 10.5124 2.25412 11.2305 2.67236C11.5344 2.8494 11.7752 3.02636 11.9512 3.16943L11.3691 3.77588C11.218 3.65698 11.0266 3.51661 10.793 3.37939C10.1767 3.01755 9.27297 2.65387 8.13379 2.65381C5.18917 2.65381 2.83398 4.99282 2.83398 8.00049C2.83416 11.1215 5.30941 13.3472 8.12695 13.3472C9.21068 13.3471 10.348 13.0529 11.2559 12.3892C12.1765 11.716 12.8354 10.6791 12.958 9.26318L13.0049 8.72021H8.62012V7.8999H13.7988C13.8165 8.07953 13.834 8.31752 13.834 8.60693C13.834 10.289 13.2306 11.6713 12.2393 12.6333C11.2463 13.5966 9.83407 14.1665 8.16699 14.1665C4.40237 14.1665 1.85369 11.1104 1.85352 8.00049C1.85352 4.79908 4.56699 1.83375 8.06641 1.8335Z"
        fill="black"
        stroke="#334155"
      />
    </svg>
  )
}
// Define the contact schema with Zod
const contactSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?\d{1,4}?[-.\s]?\d{1,3}?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(val), {
      message: "Invalid phone number format",
    }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  position: z.string().optional(),
  companyName: z.string().optional(),
  metIn: z.string().optional(),
  nextAction: z.string().optional(),
  dateOfNextAction: z.date().optional().nullable(),
  notes: z.string().optional(),
  type: z.string().optional(),
})

type ContactFormValues = z.infer<typeof contactSchema>

type LinkType = {
  title: string
  link: string
}
export default function AddContactPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [date, setDate] = useState<Date>()
  const [displayText, setDisplayText] = useState("")
  const [url, setUrl] = useState("")
  const intl = useIntl()
  const profileId = useAuth().user.selectedProfile
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [links, setLinks] = useState<LinkType[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [newLink, setNewLink] = useState<LinkType>({
    title: "",
    link: "",
  })
  const [importSource, setImportSource] = useState<"file" | "google" | "phone" | null>(null)
  const [scan, setScan] = useState<boolean | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const locale = getLocale()
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: "manual",
      fullName: "",
      phoneNumber: "",
      email: "",
      position: "",
      companyName: "",
      metIn: "",
      nextAction: "",
      dateOfNextAction: null,
      notes: "",
    },
  })

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setIsSubmitting(true)

      if (!formRef.current) return

      // Create a FormData object
      const formData = new FormData(formRef.current)

      // Add phoneNumber and email to links
      const formLinks = [...links]
      if (data.phoneNumber) {
        formLinks.push({ title: "phone", link: data.phoneNumber })
      }
      if (data.email) {
        formLinks.push({ title: "Email", link: data.email })
      }

      // Validate links
      for (const link of formLinks) {
        if (!link.title || !link.link) {
          toast.error(intl.formatMessage({ id: "Incomplete link" }, { title: link.title || "Unknown" }))
          setIsSubmitting(false)
          return
        }
        if (
          ["phone", "phone number", "mobile"].some((t) => link.title.toLowerCase().includes(t)) &&
          !/^\+?\d{1,4}?[-.\s]?\d{1,3}?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(link.link)
        ) {
          toast.error(intl.formatMessage({ id: "Invalid phone number format" }))
          setIsSubmitting(false)
          return
        }
        if (
          ["email", "e-mail"].some((t) => link.title.toLowerCase().includes(t)) &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(link.link)
        ) {
          toast.error(intl.formatMessage({ id: "Invalid email format" }))
          setIsSubmitting(false)
          return
        }
      }

      // Add tags and links as JSON strings
      formData.append("tags", JSON.stringify(tags))
      formData.append("links", JSON.stringify(formLinks))

      // Format the date as 'yyyy-MM-dd' if it exists
      if (data.dateOfNextAction) {
        formData.set("dateOfNextAction", format(data.dateOfNextAction, "yyyy-MM-dd"))
      }

      // Log form data for debugging
      console.log("Form data submitted:", {
        ...Object.fromEntries(formData.entries()),
        tags,
        links: formLinks,
      })

      // Submit the form
      const result = await createContact(profileId, formData, "manual")
      console.log("Form submission result:", profileId, formData, "manual")
      if (result?.success) {
        toast.success(intl.formatMessage({ id: "Contact added successfully" }))
        form.reset()
        setTags([])
        setLinks([])
        setTagInput("")
        setShowLinkForm(false)
        router.push(`/${locale}/app/contacts`)
      } else {
        toast.error(intl.formatMessage({ id: "Failed to add contact" }))
      }
    } catch (error: any) {
      console.error("Error submitting form:", {
        message: error.message,
        response: error.response
          ? {
              status: error.response.status,
              statusText: error.response.statusText,
              data: JSON.stringify(error.response.data, null, 2),
            }
          : "No response data available",
        stack: error.stack,
      })
      toast.error(
        error.response?.data?.message ||
          error.message ||
          intl.formatMessage({ id: "An unexpected error occurred. Please try again." }),
      )
    } finally {
      setIsSubmitting(false)
    }
  }
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

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddLinkSubmit = () => {
    if (!displayText.trim() || !url.trim()) {
      toast.error(intl.formatMessage({ id: "Please fill in all required fields" }))
      return
    }
    setLinks([...links, { title: displayText.trim(), link: url.trim() }])
    setDisplayText("")
    setUrl("")
    toast.success(intl.formatMessage({ id: "Link added successfully" }))
  }

  const handleRemoveLink = (indexToRemove: number) => {
    setLinks(links.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className="min-h-screen  ">
      {/* Header */}
      <div className="w-full bg-transparent border-b px-6 py-[13.5px] border-secondary">
        <div className="w-full flex items-center justify-between    ">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="p-2" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-medium">Add new contact</h1>
              <span className="text-sm text-blue-600">manual</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 bg-transparent border-primary  px-4 py-2">
                  <Upload className="h-4 w-4" />
                  Import
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="min-w-56 pl-6"
                    onClick={() => {
                      setImportSource("file")
                      setDialogOpen(true)
                    }}
                  >
                    <ImportIcon /> Import from file
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="min-w-56 pl-6"
                    onClick={() => {
                      setImportSource("google")
                      setDialogOpen(true)
                    }}
                  >
                    <GoogleIcon /> Import from Google
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
                onClick={() => {
                  setScan(true) // using "phone" as scan trigger
                  setDialogOpen(true)
                }}
              >
                <QrCode className="h-4 w-4" />
                Scan
              </Button>
              <DialogTitle></DialogTitle>
              <DialogContent className="max-w-3xl">
                {importSource && <ImportContacts source={importSource} />}
                {scan && <ScanContact locale="en" />}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-16">
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="w-2/3 flex justify-between items-center">
              <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Profile picture</h3>
              <p className="text-sm text-gray-500 mb-4">This will be displayed on your contact's profile</p>
              </div>
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
            <div className="flex justify-between gap-24 items-satrt flex-col lg:flex-row">
              {/* Personal Information */}
              <div className="w-full">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Personal information</h3>
                <div className="space-y-6">
                  <div className="w-full flex flex-col justify-between items-center lg:flex-row gap-4">
                    <div className="w-full">
                      <Label htmlFor="fullName" className="text-sm font-medium text-primary">
                        Full name *
                      </Label>
                      <Input id="fullName" className="mt-1" {...form.register("fullName")} />
                      {form.formState.errors.fullName && (
                        <p className="text-red-500 text-sm">{form.formState.errors.fullName.message}</p>
                      )}
                    </div>

                    <div className="w-full">
                      <Label htmlFor="phoneNumber" className="text-sm font-medium text-primary">
                        Phone number
                      </Label>
                      <Input id="phoneNumber" className="mt-1" {...form.register("phoneNumber")} />
                      {form.formState.errors.phoneNumber && (
                        <p className="text-red-500 text-sm">{form.formState.errors.phoneNumber.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="w-full flex flex-col justify-between items-center lg:flex-row gap-4">
                    <div className="w-full">
                      <Label htmlFor="companyName" className="text-sm font-medium text-primary">
                        Company name
                      </Label>
                      <Input id="companyName" className="mt-1" {...form.register("companyName")} />
                      {form.formState.errors.companyName && (
                        <p className="text-red-500 text-sm">{form.formState.errors.companyName.message}</p>
                      )}
                    </div>

                    <div className="w-full">
                      <Label htmlFor="position" className="text-sm font-medium text-primary">
                        Position
                      </Label>
                      <Input id="position" className="mt-1" {...form.register("position")} />
                      {form.formState.errors.position && (
                        <p className="text-red-500 text-sm">{form.formState.errors.position.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="w-full">
                    <Label htmlFor="email" className="text-sm font-medium text-primary">
                      Email
                    </Label>
                    <Input id="email" type="email" className="mt-1" {...form.register("email")} />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>
                 {/* Links Section */}
              <div className="w-full">
                <h3 className="text-lg font-medium text-primary mt-8 mb-4">Links</h3>
                <div className="bg-transparent rounded-lg p-6 mb-2 border border-gray-200">
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
                    <Button type="button" onClick={handleAddLinkSubmit} className="flex items-center gap-2" size="sm">
                      <Plus className="h-4 w-4" />
                      Add Link
                    </Button>
                  </div>
                  {links.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-primary mb-3">Added Links</h4>
                      <div className="space-y-2">
                        {links.map((link, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div>
                              <p className="font-medium text-sm">{link.title}</p>
                              <p className="text-sm text-gray-600 truncate">{link.link}</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveLink(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                    <Input id="metIn" placeholder="Mohammadia" className="mt-1" {...form.register("metIn")} />
                  </div>

                  <div>
                    <Label htmlFor="nextAction" className="text-sm font-medium text-primary">
                      Next action
                    </Label>
                    <Input
                      id="nextAction"
                      placeholder="eg. follow up call"
                      className="mt-1"
                      {...form.register("nextAction")}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="dateOfNextAction"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>
                            <FormattedMessage id="date-of-next-action" />
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full h-10 ps-3 text-left font-normal border-gray-200 dark:border-azure text-gray-400 dark:text-azure hover:bg-azure/30 hover:text-gray-400 dark:hover:text-azure",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "yyyy-MM-dd")
                                  ) : (
                                    <FormattedMessage id="pick-a-date" />
                                  )}
                                  <CalendarIcon className="ms-auto h-4 w-4 text-gray-400 dark:text-azure" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value || undefined} onSelect={field.onChange} />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Notes</h4>
                    <Textarea
                      className="w-full border rounded-md p-2 mt-1"
                      placeholder="Write notes..."
                      {...form.register("notes")}
                    />
                  </div>
                </div>
                <div className="w-full mt-4">
                <h3 className="text-lg font-medium text-primary mb-4">Tags</h3>
                <div className="bg-transparent rounded-lg p-6 border border-gray-200">
                  <div>
                    <Label htmlFor="tagInput" className="text-sm font-medium text-primary">
                      Add tags
                    </Label>
                    <Input
                      id="tagInput"
                      placeholder="Type a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Press Enter to add a tag</p>
                  </div>
                  {tags.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-primary mb-3">Added Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                className="border-secondary bg-transparent"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <div className="flex items-center gap-3">
                <Button type="submit" variant="outline">
                  Save and add new contact
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
