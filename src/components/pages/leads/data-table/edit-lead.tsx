"use client"

import React, { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Tag, X, Edit, FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
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
import { getContactsAction } from "@/actions/contacts"
import { editLead } from "@/actions/leads"
import { useAuth } from "@/context/authContext"
import type { Lead } from "@/types/leads"

// Define the lead schema with Zod - only name is required, everything else is optional
const leadSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    mainContact: z.string().optional(), // Remove nullable() and make it truly optional
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
    const { user } = useAuth()
    const profileId = user?.selectedProfile
    const formRef = useRef<HTMLFormElement>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [tags, setTags] = useState<string[]>(lead.Tags || [])
    const [tagInput, setTagInput] = useState("")
    const [contacts, setContacts] = useState<ComboboxOption[]>([])
    const [notes, setNotes] = useState<string[]>(lead.notes || [])
    const [noteInput, setNoteInput] = useState("")
    const [mainContactData, setMainContactData] = useState<any>(null)

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
            mainContact: getContactId(lead.mainContact) || undefined, // Use undefined instead of null
            Contacts: (lead.Contacts || []).map(contact => getContactId(contact)),
            status: lead.status || "pending",
            priority: lead.priority || "none",
            lifeTimeBegins: lead.lifeTime?.begins ? new Date(lead.lifeTime.begins) : null,
            lifeTimeEnds: lead.lifeTime?.ends ? new Date(lead.lifeTime.ends) : null,
        },
    })

    // Fetch contacts and main contact data on component mount
    useEffect(() => {
        const fetchData = async () => {
            if (profileId) {
                try {
                    const response = await getContactsAction(profileId)
                    if (response?.success && response.data) {
                        const contactOptions = response.data.map((contact: any) => ({
                            value: contact._id,
                            label: contact.Profile?.fullName || "Unknown",
                            profilePicture: contact.Profile?.profilePicture,
                        }))
                        setContacts(contactOptions)

                        // Find main contact data if exists
                        const mainContactId = getContactId(lead.mainContact)
                        if (mainContactId) {
                            const mainContact = response.data.find((contact: any) => contact._id === mainContactId)
                            if (mainContact) {
                                setMainContactData(mainContact)
                            }
                        }
                    }
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

            if (notes.length > 0) {
                formData.append("notes", JSON.stringify(notes))
            }

            // Format the dates as 'yyyy-MM-dd' if they exist
            if (data.lifeTimeBegins) {
                formData.append("lifeTimeBegins", format(data.lifeTimeBegins, "yyyy-MM-dd"))
            }
            if (data.lifeTimeEnds) {
                formData.append("lifeTimeEnds", format(data.lifeTimeEnds, "yyyy-MM-dd"))
            }

            // Submit the form
            const result = await editLead(profileId, lead._id, formData)

            if (result?.success) {
                toast.success(intl.formatMessage({ id: "Lead updated successfully" }))
                // if (onSave && result.data) {
                //     onSave(result.data)
                // }
                onClose()
            } else {
                toast.error(intl.formatMessage({ id: "Failed to update lead" }))
            }
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

    const handleAddNote = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && noteInput.trim()) {
            e.preventDefault()
            setNotes([...notes, noteInput.trim()])
            setNoteInput("")
        }
    }

    const handleRemoveNote = (noteIndex: number) => {
        setNotes(notes.filter((_, index) => index !== noteIndex))
    }

    return (
        <Card className="w-80 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg font-semibold">
                    <FormattedMessage id="edit-lead" defaultMessage="Edit Lead" />
                </CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0"
                >
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Main Contact Display */}
                {mainContactData && (
                    <div className="space-y-2">
                        <Label>
                            <FormattedMessage id="main-contact" defaultMessage="Main Contact" />
                        </Label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex-1">
                                <p className="font-medium text-sm">
                                    {mainContactData.Profile?.fullName || "Unknown"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {mainContactData.Profile?.position || "No position"}
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
                                                    // If empty string is selected, set to undefined
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

                        {/* Notes - OPTIONAL */}
                        <div>
                            <Label htmlFor="notes">
                                <FormattedMessage id="notes" defaultMessage="Notes" />
                            </Label>
                            <div className="flex items-center mt-1 mb-2">
                                <FileText className="me-2 h-4 w-4" />
                                <Input
                                    id="notes"
                                    placeholder={intl.formatMessage({ id: "add-note-placeholder", defaultMessage: "Add a note (optional)" })}
                                    value={noteInput}
                                    onChange={(e) => setNoteInput(e.target.value)}
                                    onKeyDown={handleAddNote}
                                />
                            </div>
                            {notes.length > 0 && (
                                <div className="space-y-2 mt-2">
                                    {notes.map((note, index) => (
                                        <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                            <span className="text-sm flex-1">{note}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveNote(index)}
                                                aria-label={intl.formatMessage({ id: "remove-note" })}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full mt-6 bg-azure"
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