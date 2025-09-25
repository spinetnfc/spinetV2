"use client"

import type React from "react"

import { ArrowLeft, Plus, Trash2, CalendarIcon, X, ChevronDown, ChevronRight, Phone, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRef, useState } from "react"
import { format } from "date-fns"
import { cn } from '@/utils/cn'
import z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const leadSchema = z.object({
  name: z.string().min(2, { message: "Lead name must be at least 2 characters" }),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"], { message: "Please select a priority" }),
  status: z.enum(["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"], {
    message: "Please select a status",
  }),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  notes: z.string().optional(),
})

type LeadFormValues = z.infer<typeof leadSchema>

type ContactType = {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
}

type AttachmentType = {
  name: string
  size: string
  type: string
}

type TaskType = {
  id: string
  name: string
  status: "pending" | "done"
  date?: string
  assignee: string
  assigneeInitials: string
}

type MeetingType = {
  id: string
  name: string
  status: "pending" | "done"
  date: string
  assignee: string
  assigneeInitials: string
}

type CallType = {
  id: string
  name: string
  status: "pending" | "done"
  date: string
  assignee: string
  assigneeInitials: string
}

export default function AddLeadForm() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionType, setActionType] = useState<"save" | "saveAndAdd">("save")

  const [selectedContacts, setSelectedContacts] = useState<ContactType[]>([])
  const [selectedMembers, setSelectedMembers] = useState<ContactType[]>([])
  const [attachments, setAttachments] = useState<AttachmentType[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [showMemberDialog, setShowMemberDialog] = useState(false)

  const [tasksExpanded, setTasksExpanded] = useState(true)
  const [meetingsExpanded, setMeetingsExpanded] = useState(true)
  const [callsExpanded, setCallsExpanded] = useState(true)
  const [showTagsInput, setShowTagsInput] = useState(false)
  // Mock data for contacts and members
  const availableContacts: ContactType[] = [
    { id: "1", name: "Demi Wilkinson", email: "demi@example.com", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "2", name: "Orlando Diggs", email: "orlando@example.com", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "3", name: "Olivia Rhye", email: "olivia@example.com", role: "Role at company" },
    { id: "4", name: "Lana Steiner", email: "lana@example.com", role: "Role at company" },
  ]

  const tasks: TaskType[] = [
    {
      id: "1",
      name: "Follow-up task",
      status: "pending",
      date: "29-07-2025",
      assignee: "Orlando Diggs",
      assigneeInitials: "OD",
    },
  ]

  const meetings: MeetingType[] = [
    {
      id: "1",
      name: "Follow-up meeting",
      status: "pending",
      date: "29-07-2025",
      assignee: "Orlando Diggs",
      assigneeInitials: "OD",
    },
    {
      id: "2",
      name: "Planification meeting",
      status: "done",
      date: "01-08-2025",
      assignee: "Orlando Diggs",
      assigneeInitials: "OD",
    },
  ]

  const calls: CallType[] = [
    {
      id: "1",
      name: "Follow-up call",
      status: "pending",
      date: "29-07-2025",
      assignee: "Orlando Diggs",
      assigneeInitials: "OD",
    },
    {
      id: "2",
      name: "Planification call",
      status: "done",
      date: "01-08-2025",
      assignee: "Orlando Diggs",
      assigneeInitials: "OD",
    },
    {
      id: "3",
      name: "Planification call",
      status: "done",
      date: "01-08-2025",
      assignee: "Orlando Diggs",
      assigneeInitials: "OD",
    },
  ]

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      description: "",
      priority: "Medium",
      status: "New",
      startDate: null,
      endDate: null,
      notes: "",
    },
  })

  const onSubmit = async (data: LeadFormValues) => {
    try {
      setIsSubmitting(true)

      const leadData = {
        ...data,
        contacts: selectedContacts,
        members: selectedMembers,
        attachments,
        tags,
        startDate: data.startDate ? format(data.startDate, "yyyy-MM-dd") : null,
        endDate: data.endDate ? format(data.endDate, "yyyy-MM-dd") : null,
      }

      console.log("Lead data submitted:", leadData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Lead added successfully")

      if (actionType === "save") {
        router.push("/leads")
      } else {
        // Reset form for adding another lead
        form.reset()
        setSelectedContacts([])
        setSelectedMembers([])
        setAttachments([])
        setTags([])
        setTagInput("")
      }
    } catch (error: any) {
      console.error("Error submitting form:", error)
      toast.error("Failed to add lead")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const newAttachment: AttachmentType = {
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type || "application/octet-stream",
        }
        setAttachments((prev) => [...prev, newAttachment])
      })
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

  const handleRemoveAttachment = (indexToRemove: number) => {
    setAttachments(attachments.filter((_, index) => index !== indexToRemove))
  }

  const handleAddContact = (contact: ContactType) => {
    if (!selectedContacts.find((c) => c.id === contact.id)) {
      setSelectedContacts([...selectedContacts, contact])
    }
  }

  const handleRemoveContact = (contactId: string) => {
    setSelectedContacts(selectedContacts.filter((c) => c.id !== contactId))
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="w-full bg-white border-b px-6  py-4 border-secondary ">
        <div className="w-full flex items-center justify-between px-4">
          <div className="flex items-center gap-3 lg:pl-0 pl-12">
            <Button variant="ghost" size="sm" className="p-2" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-medium">Add new lead</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 ">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-16">
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            <div className="flex gap-8 w-full">
              {/* Form Content */}
              <div className="flex justify-between gap-8 items-start flex-col  w-full lg:2/3">
                {/* Lead Information */}
                <div className="w-full ">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Lead information</h3>
                  <div className="space-y-6">
                    <div className="w-full flex flex-col justify-between items-center lg:flex-row gap-4">
                      <div className="w-full">
                        <Label htmlFor="name" className="text-sm font-medium text-primary">
                          Name *
                        </Label>
                        <Input id="name" className="mt-1" {...form.register("name")} />
                        {form.formState.errors.name && (
                          <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="w-full">
                        <Label htmlFor="description" className="text-sm font-medium text-primary">
                          Description
                        </Label>
                        <Input
                          id="description"
                          placeholder="Awaiting feedback"
                          className="mt-1"
                          {...form.register("description")}
                        />
                      </div>
                    </div>

                    <div className="w-full flex flex-col justify-between items-center lg:flex-row gap-4">
                      <div className="w-full">
                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Priority *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="w-full">
                                  <SelectItem value="Low">Low</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="w-full">
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Status *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}   >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="w-full">
                                  <SelectItem value="New">New</SelectItem>
                                  <SelectItem value="Contacted">Contacted</SelectItem>
                                  <SelectItem value="Qualified">Qualified</SelectItem>
                                  <SelectItem value="Proposal">Proposal</SelectItem>
                                  <SelectItem value="Negotiation">Negotiation</SelectItem>
                                  <SelectItem value="Closed Won">Closed Won</SelectItem>
                                  <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="w-full flex flex-col justify-between items-center lg:flex-row gap-4">
                      <div className="w-full">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Start date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full h-10 ps-3 text-left font-normal border-gray-200",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {field.value ? format(field.value, "yyyy-MM-dd") : "Select date"}
                                      <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
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

                      <div className="w-full">
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>End date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full h-10 ps-3 text-left font-normal border-gray-200",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {field.value ? format(field.value, "yyyy-MM-dd") : "Select date"}
                                      <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
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
                    </div>
                  </div>

                  <div className="w-full mt-8">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-medium text-primary">Attachments</h3>
                      {attachments.length > 0 && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {attachments.length}
                        </span>
                      )}
                      <div className="relative inline-flex items-center ml-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 pointer-events-none"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        {attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                <span className="text-blue-600 text-xs font-medium">
                                  {attachment.name.split(".").pop()?.toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">{attachment.name}</p>
                                <p className="text-xs text-gray-500">{attachment.size}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAttachment(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="w-full mt-8">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-medium text-primary">Notes</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">1</span>
                      <Button type="button" variant="ghost" size="sm" className="ml-2">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      className="w-full border rounded-md p-3"
                      placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                      rows={4}
                      {...form.register("notes")}
                    />
                    <p className="text-xs text-gray-500 mt-2">Creation date: {format(new Date(), "dd-MM-yyyy")}</p>
                  </div>
                </div>

                {/* Middle Sidebar - Contacts, Members, Tags */}
                <div className="  space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contacts</h3>
                    <div className="space-y-3">
                      {selectedContacts.map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{contact.name}</span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveContact(contact.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                        <DialogTrigger asChild>
                          <Button type="button" variant="ghost" size="sm" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add contact
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Contacts</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input placeholder="Search contact, title ..." />
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {availableContacts.map((contact) => (
                                <div
                                  key={contact.id}
                                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                  onClick={() => {
                                    handleAddContact(contact)
                                    setShowContactDialog(false)
                                  }}
                                >
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-sm">{contact.name}</p>
                                    <p className="text-xs text-gray-500">{contact.role || contact.email}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Members</h3>
                    <div className="space-y-3">
                      {selectedMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{member.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      <Button type="button" variant="ghost" size="sm" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add member
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
                    <div className="space-y-4">
                      {showTagsInput && <div>
                        <Input
                          placeholder="Type a tag and press Enter"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                        />
                        <p className="text-xs text-gray-500 mt-1">Press Enter to add a tag</p>
                      </div>}

                      {tags.length > 0 && (
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
                      )}

                      <Button type="button" variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => setShowTagsInput(!showTagsInput)}>
                        <Plus className="h-4 w-4" />
                        Add tag
                      </Button>
                    </div>
                  </div>
                </div></div>

              {/* Actions section as right sidebar */}
              <div className="w-full lg:w-1/3  space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Actions</h3>
                    <Button type="button" variant="ghost" size="sm" className="ml-auto">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Tasks Section */}
                  <div className="mb-6">
                    <div
                      className="flex items-center gap-2 cursor-pointer py-2"
                      onClick={() => setTasksExpanded(!tasksExpanded)}
                    >
                      {tasksExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <span className="text-sm font-medium text-blue-600">Tasks</span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-1">
                        {tasks.length}
                      </span>
                    </div>

                    {tasksExpanded && (
                      <div className="ml-6 space-y-3">
                        {tasks.map((task) => (
                          <div key={task.id} className="flex items-center justify-between py-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{task.name}</span>
                                {task.status === "pending" && (
                                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                    pending
                                  </span>
                                )}
                                {task.status === "done" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                              </div>
                              {task.date && <p className="text-xs text-gray-500">{task.date}</p>}
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-medium">{task.assigneeInitials}</span>
                                </div>
                                <span className="text-xs text-gray-600">{task.assignee}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Meetings Section */}
                  <div className="mb-6">
                    <div
                      className="flex items-center gap-2 cursor-pointer py-2"
                      onClick={() => setMeetingsExpanded(!meetingsExpanded)}
                    >
                      {meetingsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <span className="text-sm font-medium text-blue-600">Meetings</span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-1">
                        {meetings.length}
                      </span>
                    </div>

                    {meetingsExpanded && (
                      <div className="ml-6 space-y-3">
                        {meetings.map((meeting) => (
                          <div key={meeting.id} className="flex items-center justify-between py-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{meeting.name}</span>
                                {meeting.status === "pending" && (
                                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                    pending
                                  </span>
                                )}
                                {meeting.status === "done" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                              </div>
                              <p className="text-xs text-gray-500">{meeting.date}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-medium">{meeting.assigneeInitials}</span>
                                </div>
                                <span className="text-xs text-gray-600">{meeting.assignee}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Calls Section */}
                  <div className="mb-6">
                    <div
                      className="flex items-center gap-2 cursor-pointer py-2"
                      onClick={() => setCallsExpanded(!callsExpanded)}
                    >
                      {callsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">Calls</span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-1">
                        {calls.length}
                      </span>
                    </div>

                    {callsExpanded && (
                      <div className="ml-6 space-y-3">
                        {calls.map((call) => (
                          <div key={call.id} className="flex items-center justify-between py-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{call.name}</span>
                                {call.status === "pending" && (
                                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                    pending
                                  </span>
                                )}
                                {call.status === "done" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                              </div>
                              <p className="text-xs text-gray-500">{call.date}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-medium">{call.assigneeInitials}</span>
                                </div>
                                <span className="text-xs text-gray-600">{call.assignee}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                className="border-secondary bg-transparent"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  variant="outline"
                  onClick={() => setActionType("saveAndAdd")}
                  disabled={isSubmitting}
                >
                  Save and add new lead
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setActionType("save")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
