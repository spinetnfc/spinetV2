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
import type { Lead, LeadInput } from "@/types/leads";
import { editContact } from "@/actions/leads"
import { useAuth } from "@/context/authContext";

// Define the lead schema with Zod
const leadSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    status: z.string().optional(),
    priority: z.string().optional(),
    Tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface EditLeadFormProps {
    lead: Lead;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function EditLeadForm({
    lead,
    onSuccess,
    onCancel,
}: EditLeadFormProps) {
    const { user } = useAuth();
    const profileId = user.selectedProfile;
    const intl = useIntl();
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tags, setTags] = useState<string[]>(lead.Tags || []);
    const [tagInput, setTagInput] = useState("");

    const form = useForm<LeadFormValues>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            name: lead.name || "",
            status: lead.status || "",
            priority: lead.priority || "",
            Tags: lead.Tags || [],
            notes: lead.notes?.join("\n") || "",
        },
    });

    const onSubmit = async (data: LeadFormValues) => {
        try {
            setIsSubmitting(true);
            const editedLead: LeadInput = {
                name: data.name,
                // status: data.status,
                priority: data.priority as any,
                Tags: tags,
                // Optionally add notes or other fields if your API supports them
            };
            // const result = await editContact(profileId, lead._id, editedLead);
            // if (result.success) {
            //     toast.success(intl.formatMessage({ id: "Lead updated successfully" }));
            //     form.reset();
            //     setTags([]);
            //     setTagInput("");
            //     onSuccess();
            // } else {
            //     toast.error(result.message || "Failed to update lead");
            // }
        } catch (error) {
            toast.error(intl.formatMessage({ id: "Failed to update lead" }));
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto md:items-center">
            <div className="bg-background rounded-lg max-w-full max-h-[calc(100vh-40px)] overflow-y-auto w-full h-fit p-4 md:max-w-md md:h-auto md:min-h-0">
                <div className="rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                            <FormattedMessage id="edit-lead" />
                        </h3>
                        <button onClick={onCancel} className="text-gray-500" aria-label="Close form">
                            <X size={20} />
                        </button>
                    </div>

                    <Form {...form}>
                        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                                                <Input placeholder="Lead Name" {...field} />
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
                                            <FormControl>
                                                <Input placeholder="New" {...field} />
                                            </FormControl>
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
                                            <FormControl>
                                                <Input placeholder="High" {...field} />
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
