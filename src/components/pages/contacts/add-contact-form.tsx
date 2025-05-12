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
import { useIntl } from "react-intl";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

// Define the contact schema with Zod
const contactSchema = z.object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
    phoneNumber: z
        .string()
        .optional()
        .refine(
            (val) =>
                !val ||
                /^\+?[1-9]\d{1,14}$/.test(val) || // E.164 format
                /^0\d{9}$/.test(val), // Local format: starts with 0 and has 10 digits
            { message: "Invalid phone number" }
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
    name: string;
    title: string;
    link: string;
};

interface AddContactFormProps {
    createContact: (formData: FormData) => Promise<any>;
    themeColor: string;
}

export default function AddContactForm({ createContact, themeColor }: AddContactFormProps) {
    const intl = useIntl();
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLinkForm, setShowLinkForm] = useState(false);
    const [links, setLinks] = useState<LinkType[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [newLink, setNewLink] = useState<LinkType>({
        name: "",
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
                formLinks.push({ title: "phone", name: "Phone Number", link: data.phoneNumber });
            }
            if (data.email) {
                formLinks.push({ title: "email", name: "Email", link: data.email });
            }

            // Add tags and links as JSON strings
            formData.append("tags", JSON.stringify(tags));
            formData.append("links", JSON.stringify(formLinks));

            // Format the date as 'yyyy-MM-dd' if it exists
            if (data.dateOfNextAction) {
                formData.set("dateOfNextAction", format(data.dateOfNextAction, "yyyy-MM-dd"));
            }

            // Submit the form to the server action
            const result = await createContact(formData);

            // Handle the server response
            if (result?.success) {
                toast.success(result.message || "Contact added successfully");
                form.reset();
                setTags([]);
                setLinks([]);
                setTagInput("");
                setShowLinkForm(false);
            } else {
                toast.error(result?.message || "Failed to add contact");
            }
        } catch (error: any) {
            console.error("Error submitting form:", {
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
                "An unexpected error occurred. Please try again."
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
        if (!newLink.name || !newLink.title || !newLink.link) {
            toast.error("Please fill in all required fields");
            return;
        }

        setLinks([...links, newLink]);
        setShowLinkForm(false);
        setNewLink({ name: "", title: "", link: "" });
        toast.success("Link added successfully");
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
                                <FormLabel>Full Name*</FormLabel>
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
                                <FormLabel>Phone Number</FormLabel>
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
                                <FormLabel>Email</FormLabel>
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
                                <FormLabel>Position</FormLabel>
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
                                <FormLabel>Company Name</FormLabel>
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
                                <FormLabel>Met In (Location)</FormLabel>
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
                                <FormLabel>Next Action</FormLabel>
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
                                <FormLabel>Date of Next Action</FormLabel>
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
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex items-center mt-1 mb-2">
                        <Tag className="mr-2 h-4 w-4" />
                        <Input
                            id="tags"
                            placeholder="Add tags and press Enter"
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
                                        aria-label={`Remove ${tag} tag`}
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
                        <Label>Links</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowLinkForm(true)}
                            className="flex items-center gap-1"
                            style={{ color: themeColor, borderColor: themeColor }}
                        >
                            <Plus className="h-4 w-4" />
                            Add Link
                        </Button>
                    </div>

                    {links.length > 0 && (
                        <div className="mt-2 space-y-2">
                            {links.map((link, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                                    <LinkIcon
                                        className="h-4 w-4 text-gray-500"
                                        aria-label="Link icon"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium">{link.title}</div>
                                        <div className="text-sm text-muted-foreground">{link.name}</div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setLinks(links.filter((_, i) => i !== index))}
                                        aria-label={`Remove ${link.title} link`}
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
                                <h3 className="text-lg font-semibold">Add Link</h3>
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
                                    <Label htmlFor="linkType">Link Type*</Label>
                                    <select
                                        id="linkType"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={newLink.name}
                                        onChange={(e) =>
                                            setNewLink({ ...newLink, name: e.target.value })
                                        }
                                    >
                                        <option value="">Select link type</option>
                                        {[
                                            "website",
                                            "linkedin",
                                            "instagram",
                                            "twitter",
                                            "github",
                                            "facebook",
                                            "location",
                                            "order now",
                                            "play store",
                                            "app store",
                                            "whatsapp",
                                            "telegram",
                                            "viber",
                                            "other",
                                        ].map((type) => (
                                            <option key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="linkTitle">Display Text*</Label>
                                    <Input
                                        id="linkTitle"
                                        value={newLink.title}
                                        onChange={(e) =>
                                            setNewLink({ ...newLink, title: e.target.value })
                                        }
                                        placeholder="e.g. My Website"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="linkUrl">URL*</Label>
                                    <Input
                                        id="linkUrl"
                                        value={newLink.link || ""}
                                        onChange={(e) =>
                                            setNewLink({ ...newLink, link: e.target.value })
                                        }
                                        placeholder="https:// or phone number"
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowLinkForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="button" onClick={handleAddLinkSubmit}>
                                        Save
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
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Add any additional notes about this contact"
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
                    className="w-full mt-6"
                    disabled={isSubmitting}
                    style={{ backgroundColor: themeColor }}
                >
                    {isSubmitting ? "Saving..." : "Save Contact"}
                </Button>
            </form>
        </Form>
    );
}