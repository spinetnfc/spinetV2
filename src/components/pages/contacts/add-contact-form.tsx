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
import { useRouter } from "next/navigation";
import { createContact } from "@/actions/contacts";
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
};



export default function AddContactForm({ locale }: { locale: string }) {
    const intl = useIntl();
    const profileId = useAuth().user.selectedProfile;;
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLinkForm, setShowLinkForm] = useState(false);
    const [links, setLinks] = useState<LinkType[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [newLink, setNewLink] = useState<LinkType>({
        title: "",
        link: "",
    });

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
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
    });

    const onSubmit = async (data: ContactFormValues) => {
        try {
            setIsSubmitting(true);

            if (!formRef.current) return;

            // Create a FormData object
            const formData = new FormData(formRef.current);

            // Add phoneNumber and email to links
            const formLinks = [...links];
            if (data.phoneNumber) {
                formLinks.push({ title: "phone", link: data.phoneNumber });
            }
            if (data.email) {
                formLinks.push({ title: "Email", link: data.email });
            }

            // Validate links
            for (const link of formLinks) {
                if (!link.title || !link.link) {
                    toast.error(intl.formatMessage({ id: "Incomplete link" }, { title: link.title || "Unknown" }));
                    setIsSubmitting(false);
                    return;
                }
                if (
                    ["phone", "phone number", "mobile"].some((t) => link.title.toLowerCase().includes(t)) &&
                    !/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(link.link)
                ) {
                    toast.error(intl.formatMessage({ id: "Invalid phone number format" }));
                    setIsSubmitting(false);
                    return;
                }
                if (
                    ["email", "e-mail"].some((t) => link.title.toLowerCase().includes(t)) &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(link.link)
                ) {
                    toast.error(intl.formatMessage({ id: "Invalid email format" }));
                    setIsSubmitting(false);
                    return;
                }
            }

            // Add tags and links as JSON strings
            formData.append("tags", JSON.stringify(tags));
            formData.append("links", JSON.stringify(formLinks));

            // Format the date as 'yyyy-MM-dd' if it exists
            if (data.dateOfNextAction) {
                formData.set("dateOfNextAction", format(data.dateOfNextAction, "yyyy-MM-dd"));
            }

            // Log form data for debugging
            console.log("Form data submitted:", {
                ...Object.fromEntries(formData.entries()),
                tags,
                links: formLinks,
            });

            // Submit the form
            const result = await createContact(profileId, formData, "manual");

            if (result?.success) {
                toast.success(intl.formatMessage({ id: "Contact added successfully" }));
                form.reset();
                setTags([]);
                setLinks([]);
                setTagInput("");
                setShowLinkForm(false);
                router.push(`/${locale}/app/contacts`);
            } else {
                toast.error(intl.formatMessage({ id: "Failed to add contact" }));
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
            });
            toast.error(
                error.response?.data?.message ||
                error.message ||
                intl.formatMessage({ id: "An unexpected error occurred. Please try again." })
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
        toast.success(intl.formatMessage({ id: "Link added successfully" }));
    };

    return (
        <Form {...form}>
            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <Input placeholder={intl.formatMessage({ id: "full-name-placeholder" })} {...field} />
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
                                    <Input placeholder={intl.formatMessage({ id: "phone-number-placeholder" })} {...field} />
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
                                    <Input type="email" placeholder={intl.formatMessage({ id: "email-placeholder" })} {...field} />
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
                                    <Input placeholder={intl.formatMessage({ id: "position-placeholder" })} {...field} />
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
                                    <Input placeholder={intl.formatMessage({ id: "company-name-placeholder" })} {...field} />
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
                                    <Input placeholder={intl.formatMessage({ id: "met-in-placeholder" })} {...field} />
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
                                    <Input placeholder={intl.formatMessage({ id: "next-action-placeholder" })} {...field} />
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
                                                    "w-full h-10 ps-3 text-left font-normal border-gray-200 dark:border-azure text-gray-400 dark:text-azure hover:bg-azure/30 hover:text-gray-400 dark:hover:text-azure"
                                                )}
                                            >
                                                {field.value ? format(field.value, "yyyy-MM-dd") : <FormattedMessage id="pick-a-date" />}
                                                <CalendarIcon className="ms-auto h-4 w-4 text-gray-400 dark:text-azure" />
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
                        <Tag className="me-2 h-4 w-4" />
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
                            className="flex items-center gap-1 text-azure border-azure"
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
                                    aria-label={intl.formatMessage({ id: "close-link-form" })}
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
                                        placeholder={intl.formatMessage({ id: "display-text-placeholder" })}
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
                                        placeholder={intl.formatMessage({ id: "url-placeholder" })}
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
                <Button
                    type="submit"
                    className="w-full mt-6 bg-azure"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <FormattedMessage id="saving" /> : <FormattedMessage id="save" />}
                </Button>
            </form>
        </Form>
    );
}
