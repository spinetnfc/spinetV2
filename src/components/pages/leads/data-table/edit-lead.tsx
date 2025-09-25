"use client"

import React, { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, parse } from "date-fns"
import { CalendarIcon, Tag, X, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { cn } from '@/utils/cn'
import { toast } from "sonner"
import { useIntl, FormattedMessage } from "react-intl"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MultiCombobox, ComboboxOption } from "@/components/ui/combobox"
import { useUser } from "@/lib/store/auth-store"
import type { Lead, Note } from "@/types/leads"
import { ProfileAvatar } from "../../profile/profile-avatar"

// Helper function to safely parse date strings
const parseDate = (dateString?: string | null): Date | null => {
    if (!dateString) return null;
    try {
        // Try parsing as ISO 8601
        const isoDate = new Date(dateString);
        if (!isNaN(isoDate.getTime())) return isoDate;

        // Try parsing as yyyy-MM-dd
        const parsed = parse(dateString, "yyyy-MM-dd", new Date());
        if (!isNaN(parsed.getTime())) return parsed;

        console.error(`Invalid date format: ${dateString}`);
        return null;
    } catch (error) {
        console.error(`Error parsing date: ${dateString}`, error);
        return null;
    }
};

// Define the lead schema with Zod - only name is required, everything else is optional
const leadSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    mainContact: z.string().optional(),
    Contacts: z.array(z.string()).optional(),
    status: z.enum(["pending", "prospecting", "offer-sent", "negotiation", "administrative-validation", "done", "failed", "canceled"]).optional(),
    priority: z.enum(["none", "low", "medium", "high", "critical"]).optional(),
    lifeTimeBegins: z.date().optional().nullable(),
    lifeTimeEnds: z.date().optional().nullable(),
})

type LeadFormValues = z.infer<typeof leadSchema>

interface EditLeadPanelProps {
    lead: Lead
    onClose: () => void
    onSave?: (updatedLead: Lead) => void
}

export const EditLeadPanel: React.FC<EditLeadPanelProps> = ({ lead, onClose, onSave }) => {
    const intl = useIntl()
    const user = useUser()
    const profileId = user?.selectedProfile
    const formRef = useRef<HTMLFormElement>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [tags, setTags] = useState<string[]>(lead.Tags || [])
    const [tagInput, setTagInput] = useState("")
    const [contacts, setContacts] = useState<ComboboxOption[]>([])
    const [notes, setNotes] = useState<Note[]>(lead.notes || [])
    const [noteInput, setNoteInput] = useState("")
    const [mainContactData, setMainContactData] = useState<any>(null)
    const [selectedContactsData, setSelectedContactsData] = useState<any[]>([])
    const [moreEdits, setMoreEdits] = useState(false)

    // Helper function to extract contact ID from potentially nested object
    const getContactId = (contact: any): string => {
        if (typeof contact === 'string') return contact
        if (typeof contact === 'object' && contact?._id) return contact._id
        return ""
    }

    const form = useForm<LeadFormValues>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            name: lead.name || "",
            description: lead.description || "",
            mainContact: getContactId(lead.mainContact) || undefined,
            Contacts: (lead.Contacts || []).map(contact => getContactId(contact)),
            status: lead.status || "pending",
            priority: lead.priority || "none",
            lifeTimeBegins: parseDate(lead.lifeTime?.begins),
            lifeTimeEnds: parseDate(lead.lifeTime?.ends),
        },
    })

    // Fetch contacts and main contact data on component mount
    useEffect(() => {
        const fetchData = async () => {
            if (profileId) {
                try {
                    // Mock contacts - replace with hardcoded data
                    const mockContacts = [
                        { _id: "contact-1", Profile: { fullName: "John Smith", profilePicture: "" } },
                        { _id: "contact-2", Profile: { fullName: "Jane Doe", profilePicture: "" } }
                    ];
                    const contactOptions = mockContacts.map((contact: any) => ({
                        value: contact._id,
                        label: contact.Profile?.fullName || "Unknown",
                        profilePicture: contact.Profile?.profilePicture,
                    }))
                    setContacts(contactOptions)

                    // Find main contact data if exists
                    const mainContactId = getContactId(lead.mainContact)
                    if (mainContactId) {
                        const mainContact = mockContacts.find((contact: any) => contact._id === mainContactId)
                        if (mainContact) {
                            setMainContactData(mainContact)
                        }
                    }

                    // Find selected contacts data
                    const selectedContactIds = (lead.Contacts || []).map(contact => getContactId(contact))
                    const selectedContacts = mockContacts.filter((contact: any) =>
                        selectedContactIds.includes(contact._id)
                    )
                    setSelectedContactsData(selectedContacts)
                } catch (error) {
                    console.error("Error fetching contacts:", error)
                }
            }
        }
        fetchData()
    }, [profileId, lead.mainContact])

    const onSubmit = async (data: LeadFormValues) => {
        try {
            setIsSubmitting(true)

            if (!formRef.current) return

            // Create a FormData object
            const formData = new FormData()

            // Only append form data fields that have values
            formData.append("name", data.name)

            if (data.description && data.description.trim()) {
                formData.append("description", data.description)
            }

            if (data.mainContact && data.mainContact.trim()) {
                formData.append("mainContact", data.mainContact)
            }

            if (data.Contacts && data.Contacts.length > 0) {
                formData.append("Contacts", JSON.stringify(data.Contacts))
            }

            if (data.status && data.status !== "pending") {
                formData.append("status", data.status)
            }

            if (data.priority && data.priority !== "none") {
                formData.append("priority", data.priority)
            }

            if (tags.length > 0) {
                formData.append("tags", JSON.stringify(tags))
            }

            // Format the dates as ISO 8601 if they exist
            if (data.lifeTimeBegins) {
                formData.append("lifeTimeBegins", data.lifeTimeBegins.toISOString())
            }
            if (data.lifeTimeEnds) {
                formData.append("lifeTimeEnds", data.lifeTimeEnds.toISOString())
            }

            // Submit the form
            // Mock edit lead - replace with hardcoded behavior
            console.log("Mock edit lead:", profileId, lead._id, formData);
            toast.success(intl.formatMessage({ id: "Lead updated successfully" }))
            onClose()
        } catch (error: any) {
            console.error("Error updating lead:", error)
            toast.error(
                error.response?.data?.message ||
                error.message ||
                intl.formatMessage({ id: "An unexpected error occurred. Please try again." })
            )
        } finally {
            setIsSubmitting(false)
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

    const handleAddNote = async () => {
        if (noteInput.trim() && profileId) {
            try {
                const newNote: Note = {
                    note: noteInput.trim(),
                    createdBy: {
                        type: "employee",
                        creator: user?._id || "",
                        refModel: "Profile"
                    },
                    createdAt: new Date().toISOString()
                }

                // Mock add note - replace with hardcoded behavior
                console.log("Mock add note:", profileId, lead._id, noteInput.trim());
                setNotes([...notes, newNote])
                setNoteInput("")
                toast.success(intl.formatMessage({ id: "Note added successfully" }))
            } catch (error: any) {
                console.error("Error adding note:", error)
                toast.error(
                    error.response?.data?.message ||
                    error.message ||
                    intl.formatMessage({ id: "An unexpected error occurred. Please try again." })
                )
            }
        }
    }

    const handleRemoveNote = (noteIndex: number) => {
        setNotes(notes.filter((_, index) => index !== noteIndex))
    }

    const formatNoteDate = (dateString?: string) => {
        if (!dateString) return ""
        try {
            return format(new Date(dateString), "yyyy-MM-dd")
        } catch {
            return ""
        }
    }

    return (
        <Card className="w-sm h-full max-h-[calc(100vh-120px)] overflow-auto xl:bg-transparent
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:my-1
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-gray-800
        dark:[&::-webkit-scrollbar-thumb]:bg-navy"
        >
            <CardHeader className="w-full p-2 pb-0">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="ms-auto h-8 w-8 p-0"
                >
                    <X className="h-6 w-6" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Main Contact Display */}
                {mainContactData && (
                    <div className="space-y-2">
                        <div className="flex flex-col items-center gap-2">
                            <ProfileAvatar profilePicture={mainContactData.Profile.profilePicture} height={64} width={64} />
                            <div className="flex-1">
                                <p className="font-medium">
                                    {mainContactData.Profile?.fullName || "Unknown"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {mainContactData.Profile?.position}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <Form {...form}>
                    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name - REQUIRED */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <FormattedMessage id="name" />
                                        <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={intl.formatMessage({ id: "name-placeholder" })}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Main Contact Selection (only if no main contact exists) - OPTIONAL */}
                        {!mainContactData && (
                            <FormField
                                control={form.control}
                                name="mainContact"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <FormattedMessage id="main-contact" />
                                        </FormLabel>
                                        <FormControl>
                                            <MultiCombobox
                                                options={contacts}
                                                value={field.value || ""}
                                                onValueChange={(value) => {
                                                    field.onChange(value === "" ? undefined : value)
                                                }}
                                                placeholder={intl.formatMessage({ id: "main-contact-placeholder", defaultMessage: "Select a main contact (optional)" })}
                                                searchPlaceholder={intl.formatMessage({ id: "search-contacts" })}
                                                emptyMessage={intl.formatMessage({ id: "no-contacts-found" })}
                                                multiple={false}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="flex gap-2">
                            {/* Status - OPTIONAL */}
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <FormattedMessage id="status" />
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={intl.formatMessage({ id: "status-placeholder", defaultMessage: "Select status (optional)" })} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="pending">
                                                    <FormattedMessage id="pending" />
                                                </SelectItem>
                                                <SelectItem value="prospecting">
                                                    <FormattedMessage id="prospecting" />
                                                </SelectItem>
                                                <SelectItem value="offer-sent">
                                                    <FormattedMessage id="offer-sent" />
                                                </SelectItem>
                                                <SelectItem value="negotiation">
                                                    <FormattedMessage id="negotiation" />
                                                </SelectItem>
                                                <SelectItem value="administrative-validation">
                                                    <FormattedMessage id="administrative-validation" />
                                                </SelectItem>
                                                <SelectItem value="done">
                                                    <FormattedMessage id="done" />
                                                </SelectItem>
                                                <SelectItem value="failed">
                                                    <FormattedMessage id="failed" />
                                                </SelectItem>
                                                <SelectItem value="canceled">
                                                    <FormattedMessage id="canceled" />
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Priority - OPTIONAL */}
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <FormattedMessage id="priority" />
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={intl.formatMessage({ id: "priority-placeholder", defaultMessage: "Select priority (optional)" })} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    <FormattedMessage id="none" />
                                                </SelectItem>
                                                <SelectItem value="low">
                                                    <FormattedMessage id="low" />
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    <FormattedMessage id="medium" />
                                                </SelectItem>
                                                <SelectItem value="high">
                                                    <FormattedMessage id="high" />
                                                </SelectItem>
                                                <SelectItem value="critical">
                                                    <FormattedMessage id="critical" />
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Description - OPTIONAL */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <FormattedMessage id="description" />
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={intl.formatMessage({ id: "description-placeholder", defaultMessage: "Add description (optional)" })}
                                            className="min-h-[80px]"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <button type="button" onClick={() => setMoreEdits(!moreEdits)}
                            className="flex w-full text-sm text-azure justify-center items-center cursor-pointer">
                            {moreEdits ? <><FormattedMessage id="show-less" /> <ChevronUp /></> : <><FormattedMessage id="show-more" />  <ChevronDown /></>}
                        </button>
                        <div className={`${moreEdits ? "block" : "hidden"} space-y-4 transition-transform duration-200`}>
                            <div className="flex gap-2">
                                {/* Start Date - OPTIONAL */}
                                <FormField
                                    control={form.control}
                                    name="lifeTimeBegins"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>
                                                <FormattedMessage id="start-date" />
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full h-10 ps-3 text-left font-normal border-gray-200 dark:border-azure text-gray-400 dark:text-azure hover:bg-azure/30 hover:text-gray-400 dark:hover:text-azure"
                                                            )}
                                                        >
                                                            {field.value ? format(field.value, "yyyy-MM-dd") : <FormattedMessage id="pick-a-date" defaultMessage="Pick a date (optional)" />}
                                                            <CalendarIcon className="ms-auto h-4 w-4" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value || undefined}
                                                        onSelect={field.onChange}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* End Date - OPTIONAL */}
                                <FormField
                                    control={form.control}
                                    name="lifeTimeEnds"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>
                                                <FormattedMessage id="end-date" />
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full h-10 ps-3 text-left font-normal border-gray-200 dark:border-azure text-gray-400 dark:text-azure hover:bg-azure/30 hover:text-gray-400 dark:hover:text-azure"
                                                            )}
                                                        >
                                                            {field.value ? format(field.value, "yyyy-MM-dd") : <FormattedMessage id="pick-a-date" defaultMessage="Pick a date (optional)" />}
                                                            <CalendarIcon className="ms-auto h-4 w-4" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value || undefined}
                                                        onSelect={field.onChange}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Additional Contacts - OPTIONAL */}
                            <FormField
                                control={form.control}
                                name="Contacts"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <FormattedMessage id="contacts" />
                                        </FormLabel>
                                        <FormControl>
                                            <MultiCombobox
                                                options={contacts}
                                                value={field.value || []}
                                                onValueChange={field.onChange}
                                                placeholder={intl.formatMessage({ id: "contacts-placeholder", defaultMessage: "Select contacts (optional)" })}
                                                searchPlaceholder={intl.formatMessage({ id: "search-contacts" })}
                                                emptyMessage={intl.formatMessage({ id: "no-contacts-found" })}
                                                multiple={true}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Tags - OPTIONAL */}
                            <div>
                                <Label htmlFor="tags">
                                    <FormattedMessage id="tags" />
                                </Label>
                                <div className="flex items-center mt-1 mb-2">
                                    <Tag className="me-2 h-4 w-4" />
                                    <Input
                                        id="tags"
                                        placeholder={intl.formatMessage({ id: "add-tags-placeholder", defaultMessage: "Add tags (optional)" })}
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                    />
                                </div>
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    aria-label={intl.formatMessage({ id: "remove-tag" }, { tag })}
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Add Notes - OPTIONAL */}
                            <div>
                                <Label htmlFor="notes">
                                    <FormattedMessage id="notes" defaultMessage="Add Notes" />
                                </Label>
                                <div className="flex flex-col gap-2 mt-1 mb-2">
                                    <Textarea
                                        id="notes"
                                        placeholder={intl.formatMessage({ id: "add-note-placeholder", defaultMessage: "Add a note (optional)" })}
                                        value={noteInput}
                                        onChange={(e) => setNoteInput(e.target.value)}
                                        className="min-h-[60px] flex-1"
                                    />
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={handleAddNote}
                                        disabled={!noteInput.trim()}
                                        className="self-end"
                                    >
                                        <FormattedMessage id="add" defaultMessage="Add" />
                                    </Button>
                                </div>
                            </div>

                            {/* Current Notes Display */}
                            {notes.length > 0 && (
                                <div className="space-y-2">
                                    <div className="space-y-3 ">
                                        {notes.map((note, index) => (
                                            <div key={index} className="flex items-start gap-2 p-3 bg-gray-200 dark:bg-navy rounded">
                                                <div className="flex-1">
                                                    <p className="text-sm mb-1">{note.note}</p>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span>
                                                            <FormattedMessage
                                                                id="created-by"
                                                                defaultMessage="Created by {type}"
                                                                values={{ type: note.createdBy?.type || "unknown" }}
                                                            />
                                                        </span>
                                                        {note.createdAt && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{formatNoteDate(note.createdAt)}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveNote(index)}
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-azure"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <FormattedMessage id="saving" /> : <FormattedMessage id="save-changes" />}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}