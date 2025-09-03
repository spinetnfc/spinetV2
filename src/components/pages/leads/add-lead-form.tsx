"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Tag, X } from "lucide-react";
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
import { createLead } from "@/actions/leads";
import { getContactsAction } from "@/actions/contacts";
import { useAuth } from "@/context/authContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MultiCombobox, ComboboxOption } from "@/components/ui/combobox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Define the lead schema with Zod
const leadSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    description: z.string().optional(),
    mainContact: z.string().nullable().optional(),
    Contacts: z.array(z.string()).optional(),
    status: z.enum(["pending", "prospecting", "offer-sent", "negotiation", "administrative-validation", "done", "failed", "canceled"]).optional(),
    priority: z.enum(["none", "low", "medium", "high", "critical"]).optional(),
    lifeTimeBegins: z.date().optional().nullable(),
    lifeTimeEnds: z.date().optional().nullable(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export default function AddLeadForm({ locale, onSave, onClose }: { locale: string; onSave: () => void; onClose: () => void }) {
    const intl = useIntl();
    const { user } = useAuth();
    const profileId = user?.selectedProfile;
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [contacts, setContacts] = useState<ComboboxOption[]>([]);

    const form = useForm<LeadFormValues>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            name: "",
            description: "",
            mainContact: null,
            Contacts: [],
            status: "pending",
            priority: "none",
            lifeTimeBegins: null,
            lifeTimeEnds: null,
        },
    });

    // Fetch contacts on component mount
    useEffect(() => {
        const fetchContacts = async () => {
            if (profileId) {
                try {
                    const response = await getContactsAction(profileId);
                    if (response?.success && response.data) {
                        const contactOptions = response.data.map((contact: any) => ({
                            value: contact._id,
                            label:  contact.Profile?.fullName || "Unknown",
                        }));
                        setContacts(contactOptions);
                    } else {
                        toast.error(intl.formatMessage({ id: "Failed to fetch contacts" }));
                    }
                } catch (error) {
                    console.error("Error fetching contacts:", error);
                    toast.error(intl.formatMessage({ id: "An unexpected error occurred. Please try again." }));
                }
            }
        };
        fetchContacts();
    }, [profileId, intl]);

    const onSubmit = async (data: LeadFormValues) => {
        try {
            setIsSubmitting(true);

            if (!formRef.current) return;

            // Create a FormData object
            const formData = new FormData(formRef.current);

            // Explicitly append form data fields
            formData.append("name", data.name);
            if (data.description) formData.append("description", data.description);
            if (data.mainContact) formData.append("mainContact", data.mainContact);
            formData.append("Contacts", JSON.stringify(data.Contacts || []));
            formData.append("status", data.status || "pending");
            formData.append("priority", data.priority || "none");
            formData.append("tags", JSON.stringify(tags));

            // Format the dates as 'yyyy-MM-dd' if they exist
            if (data.lifeTimeBegins) {
                formData.set("lifeTimeBegins", format(data.lifeTimeBegins, "yyyy-MM-dd"));
            }
            if (data.lifeTimeEnds) {
                formData.set("lifeTimeEnds", format(data.lifeTimeEnds, "yyyy-MM-dd"));
            }

            // Log form data for debugging
            console.log("Form data submitted:", {
                ...Object.fromEntries(formData.entries()),
                tags,
                contacts: data.Contacts,
            });

            // Submit the form
            const result = await createLead(profileId, formData);

            if (result?.success) {
                toast.success(intl.formatMessage({ id: "Lead added successfully" }));
                form.reset();
                setTags([]);
                setTagInput("");
                router.push(`/${locale}/app/leads`);
            } else {
                toast.error(intl.formatMessage({ id: "Failed to add lead" }));
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

    return (
        <Card className="w-sm h-full  overflow-auto xl:bg-transparent
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
                <Form {...form}>
                    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <FormattedMessage id="name" />
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder={intl.formatMessage({ id: "name-placeholder" })} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Main Contact */}
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
                                                onValueChange={field.onChange}
                                                placeholder={intl.formatMessage({ id: "main-contact-placeholder" })}
                                                searchPlaceholder={intl.formatMessage({ id: "search-contacts" })}
                                                emptyMessage={intl.formatMessage({ id: "no-contacts-found" })}
                                                multiple={false}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Status */}
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
                                                    <SelectValue placeholder={intl.formatMessage({ id: "status-placeholder" })} />
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

                            {/* Priority */}
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
                                                    <SelectValue placeholder={intl.formatMessage({ id: "priority-placeholder" })} />
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

                            {/* LifeTime Begins */}
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
                                                        {field.value ? format(field.value, "yyyy-MM-dd") : <FormattedMessage id="pick-a-date" />}
                                                        <CalendarIcon className="ms-auto h-4 w-4 text-gray-400 dark:text-azurelaceeeeee" />
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

                            {/* LifeTime Ends */}
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
                                                        {field.value ? format(field.value, "yyyy-MM-dd") : <FormattedMessage id="pick-a-date" />}
                                                        <CalendarIcon className="ms-auto h-4 w-4 text-gray-400 dark:text-azurelaceeeeee" />
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

                            {/* Contacts */}
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
                                                placeholder={intl.formatMessage({ id: "contacts-placeholder" })}
                                                searchPlaceholder={intl.formatMessage({ id: "search-contacts" })}
                                                emptyMessage={intl.formatMessage({ id: "no-contacts-found" })}
                                                multiple={true}
                                            />
                                        </FormControl>
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

                        {/* Description */}
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
                                            placeholder={intl.formatMessage({ id: "description-placeholder" })}
                                            className="min-h-[100px]"
                                            {...field}
                                            value={field.value || ""}
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
            </CardContent>
        </Card>
    );
}