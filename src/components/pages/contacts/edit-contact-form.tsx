"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, LinkIcon, Plus, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIntl, FormattedMessage } from "react-intl";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import type { Contact, ContactInput } from "@/types/contact";
import { editContact } from "@/actions/contacts"
import { useAuth } from "@/context/authContext";

// Define the contact schema with Zod
const contactSchema = z.object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
    phoneNumber: z
        .string()
        .optional()
        .refine(
            (val) =>
                !val ||
                /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(val),
            { message: "Invalid phone number format" }
        ),
    email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
    position: z.string().optional(),
    companyName: z.string().optional(),
    metIn: z.string().optional(),
    nextAction: z.string().optional(),
    dateOfNextAction: z.date().optional().nullable(),
    notes: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type LinkType = {
    title: string;
    link: string;
    isLocked?: boolean;
    _id?: string;
};

interface EditContactFormProps {
    // profileId: string | null;
    contact: Contact;
    onSuccess: () => void;
    onCancel: () => void;
    // editContact: (contactId: string, contact: ContactInput) => Promise<{ success: boolean; message: string }>;
}

export default function EditContactForm({
    // profileId,
    contact,
    onSuccess,
    onCancel,
    // editContact,
}: EditContactFormProps) {
    const { user } = useAuth();
    const profileId = user.selectedProfile;
    const intl = useIntl();
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLinkForm, setShowLinkForm] = useState(false);
    const [links, setLinks] = useState<LinkType[]>(
        contact.Profile?.links || []
    );
    const [tags, setTags] = useState<string[]>(
        contact.leadCaptions?.tags || []
    );
    const [tagInput, setTagInput] = useState("");
    const [newLink, setNewLink] = useState<LinkType>({ title: "", link: "" });

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            fullName: contact.Profile?.fullName || "",
            phoneNumber:
                contact.Profile?.links?.find((link) =>
                    ["phone", "phone number", "mobile"].some((t) => link.title.toLowerCase().includes(t))
                )?.link || "",
            email:
                contact.Profile?.links?.find((link) =>
                    ["email", "e-mail"].some((t) => link.title.toLowerCase().includes(t))
                )?.link || "",
            position: contact.Profile?.position || "",
            companyName: contact.Profile?.companyName || "",
            metIn: contact.leadCaptions?.metIn || "",
            nextAction: contact.leadCaptions?.nextAction || "",
            dateOfNextAction: contact.leadCaptions?.dateOfNextAction
                ? new Date(contact.leadCaptions.dateOfNextAction)
                : null,
            notes: contact.leadCaptions?.notes || "",
        },
    });

    const onSubmit = async (data: ContactFormValues) => {
        try {
            setIsSubmitting(true);

            // Construct links, avoiding duplicates
            const formLinks = [...links].map(({ title, link }) => ({
                title,
                link,
            }));
            if (data.phoneNumber) {
                const existingPhoneIndex = formLinks.findIndex((link) =>
                    ["phone", "phone number", "mobile"].some((t) => link.title.toLowerCase().includes(t))
                );
                if (existingPhoneIndex >= 0) {
                    formLinks[existingPhoneIndex] = {
                        title: "phone",
                        link: data.phoneNumber,
                    };
                } else {
                    formLinks.push({ title: "phone", link: data.phoneNumber });
                }
            }
            if (data.email) {
                const existingEmailIndex = formLinks.findIndex((link) =>
                    ["email", "e-mail"].some((t) => link.title.toLowerCase().includes(t))
                );
                if (existingEmailIndex >= 0) {
                    formLinks[existingEmailIndex] = {
                        title: "Email",
                        link: data.email,
                    };
                } else {
                    formLinks.push({ title: "Email", link: data.email });
                }
            }

            // Validate links
            for (const link of formLinks) {
                if (!link.title || !link.link) {
                    toast.error(intl.formatMessage({ id: "Incomplete link" }, { title: link.title || "Unknown" }));
                    return;
                }
                if (
                    ["phone", "phone number", "mobile"].some((t) => link.title.toLowerCase().includes(t)) &&
                    !/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(link.link)
                ) {
                    toast.error(intl.formatMessage({ id: "Invalid phone number format" }));
                    return;
                }
                if (
                    ["email", "e-mail"].some((t) => link.title.toLowerCase().includes(t)) &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(link.link)
                ) {
                    toast.error(intl.formatMessage({ id: "Invalid email format" }));
                    return;
                }
            }

            const editedContact: ContactInput = {
                name: data.fullName,
                type: contact.type,
                profile: {
                    fullName: data.fullName,
                    position: data.position || undefined,
                    companyName: data.companyName || undefined,
                    profilePicture: contact.Profile?.profilePicture,
                    links: formLinks.length > 0 ? formLinks : undefined,
                },
                leadCaptions: {
                    metIn: data.metIn || undefined,
                    date: contact.leadCaptions?.date || new Date().toISOString(),
                    tags: tags.length > 0 ? tags : undefined,
                    nextAction: data.nextAction || undefined,
                    dateOfNextAction: data.dateOfNextAction
                        ? format(data.dateOfNextAction, "yyyy-MM-dd")
                        : undefined,
                    notes: data.notes || undefined,
                },
            };

            // Log payload for debugging
            console.log("Edit contact payload:", JSON.stringify(editedContact, null, 2));

            const result = await editContact(profileId, contact._id, editedContact);

            if (result.success) {
                toast.success(intl.formatMessage({ id: "Contact updated successfully" }));
                form.reset();
                setTags([]);
                setLinks([]);
                setTagInput("");
                setShowLinkForm(false);
                onSuccess();
            } else {
                toast.error(result.message || intl.formatMessage({ id: "Failed to update contact" }));
            }
        } catch (error: any) {
            console.error("Error updating contact:", {
                message: error.message,
                response: error.response
                    ? {
                        status: error.response.status,
                        statusText: error.response.statusText,
                        data: error.response.data,
                    }
                    : "No response data available",
                stack: error.stack,
            });
            toast.error(
                error.response?.data?.message ||
                error.message ||
                intl.formatMessage({ id: "Failed to update contact. Please try again." })
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleAddLinkSubmit = () => {
        if (!newLink.title || !newLink.link) {
            toast.error(intl.formatMessage({ id: "Please fill in all required fields" }));
            return;
        }
        setLinks([...links, newLink]);
        setShowLinkForm(false);
        setNewLink({ title: "", link: "" });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto md:items-center">
            <div className="bg-background rounded-lg max-w-full max-h-[calc(100vh-40px)] overflow-y-auto w-full h-fit p-4 md:max-w-md md:h-auto md:min-h-0">
                <div className="rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                            <FormattedMessage id="edit-contact" />
                        </h3>
                        <button onClick={onCancel} className="text-gray-500" aria-label="Close form">
                            <X size={20} />
                        </button>
                    </div>

                    <Form {...form}>
                        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <FormattedMessage id="full-name" />
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Phone Number */}
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <FormattedMessage id="phone-number" />
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="+1 234 567 8900" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <FormattedMessage id="email" />
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="john@example.com" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Position */}
                                <FormField
                                    control={form.control}
                                    name="position"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <FormattedMessage id="position" />
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="CEO" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Company Name */}
                                <FormField
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <FormattedMessage id="company-name" />
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Acme Inc." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Met In (Location) */}
                                <FormField
                                    control={form.control}
                                    name="metIn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <FormattedMessage id="met-in" />
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Conference in New York" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Next Action */}
                                <FormField
                                    control={form.control}
                                    name="nextAction"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <FormattedMessage id="next-action" />
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Follow up call" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Date of Next Action */}
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
                                                                "w-full pl-3 text-left font-normal border-gray-200 dark:border-blue-950 text-gray-400 dark:text-blue-800",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? format(field.value, "yyyy-MM-dd") : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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

                            {/* Tags */}
                            <div>
                                <Label htmlFor="tags">
                                    <FormattedMessage id="tags" />
                                </Label>
                                <div className="flex items-center mt-1 mb-2">
                                    <Tag className="mr-2 h-4 w-4" />
                                    <Input
                                        id="tags"
                                        placeholder={intl.formatMessage({ id: "add-tags-placeholder" })}
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

                            {/* Links */}
                            <div>
                                <div className="flex justify-between items-center">
                                    <Label>
                                        <FormattedMessage id="links" />
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowLinkForm(true)}
                                        className="flex items-center gap-1"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <FormattedMessage id="add-link" />
                                    </Button>
                                </div>

                                {links.length > 0 && (
                                    <div className="mt-2 space-y-2">
                                        {links.map((link, index) => (
                                            <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                                                <LinkIcon className="h-4 w-4 text-gray-500" aria-label="Link icon" />
                                                <div className="flex-1">
                                                    <div className="font-medium">{link.title}</div>
                                                    <div className="text-sm text-muted-foreground">{link.link}</div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setLinks(links.filter((_, i) => i !== index))}
                                                    aria-label={intl.formatMessage({ id: "remove-link" }, { title: link.title })}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {showLinkForm && (
                                    <div className="mt-2 border rounded-md p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">
                                                <FormattedMessage id="add-link" />
                                            </h3>
                                            <button
                                                onClick={() => setShowLinkForm(false)}
                                                className="text-gray-500"
                                                aria-label="Close link form"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="linkTitle">
                                                    <FormattedMessage id="display-text" />
                                                </Label>
                                                <Input
                                                    id="linkTitle"
                                                    value={newLink.title}
                                                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                                                    placeholder="e.g. Phone Number"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="linkUrl">
                                                    <FormattedMessage id="url" />
                                                </Label>
                                                <Input
                                                    id="linkUrl"
                                                    value={newLink.link || ""}
                                                    onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
                                                    placeholder="https:// or phone number"
                                                />
                                            </div>

                                            <div className="flex justify-end gap-2">
                                                <Button type="button" variant="outline" onClick={() => setShowLinkForm(false)}>
                                                    <FormattedMessage id="cancel" />
                                                </Button>
                                                <Button type="button" onClick={handleAddLinkSubmit}>
                                                    <FormattedMessage id="save" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Notes */}
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <FormattedMessage id="notes" />
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={intl.formatMessage({ id: "notes-placeholder" })}
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={onCancel}>
                                    <FormattedMessage id="cancel" />
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <FormattedMessage id="saving" />
                                    ) : (
                                        <FormattedMessage id="save" />
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
