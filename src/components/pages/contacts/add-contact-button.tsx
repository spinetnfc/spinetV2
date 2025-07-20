"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/authContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { profile } from "console";
import { format, set } from "date-fns";
import { CalendarIcon, UserPlus, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../ui/button";
import { cn } from "@/utils/cn";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { InviteContact } from "@/types/contact";
import { sendInvitationAction } from "@/actions/contacts";

const contactSchema = z.object({
    profile: z.string().length(24, { message: "Profile ID must be 24 characters" }),
    metIn: z.string().optional(),
    date: z.string().optional(),
    tags: z.array(z.string()).optional(),
    nextAction: z.string().optional(),
    dateOfNextAction: z.date().optional().nullable(),
    notes: z.string().optional(),
});
type ContactFormValues = z.infer<typeof contactSchema>;


const AddContactButton = () => {
    const { isAuthenticated, user } = useAuth();
    const profileId = user.selectedProfile;
    const pathname = usePathname();
    const newContactId = pathname.split("/").pop();
    const intl = useIntl();
    const [showAddContact, setShowAddContact] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            profile: newContactId || "",
            metIn: "",
            date: "",
            tags: [],
            nextAction: "",
            dateOfNextAction: null,
            notes: "",
        },
    });

    const onSubmit = async (data: ContactFormValues) => {
        try {
            setIsSubmitting(true);
            const addedContact: InviteContact = {
                profile: data.profile,
                leadCaptions: {
                    metIn: data.metIn || undefined,
                    date: data.date
                        ? format(data.date, "yyyy-MM-dd")
                        : undefined,
                    tags: (data.tags ?? []).length > 0 ? data.tags : undefined,
                    nextAction: data.nextAction || undefined,
                    dateOfNextAction: data.dateOfNextAction
                        ? format(data.dateOfNextAction, "yyyy-MM-dd")
                        : undefined,
                    notes: data.notes || undefined,
                },
            };

            // Log payload for debugging
            console.log("Add contact payload:", JSON.stringify(addedContact, null, 2));

            const response = await sendInvitationAction(profileId, addedContact);
            toast.success(intl.formatMessage({ id: "invitation-sent", defaultMessage: "Invitation sent" }));

        } catch (error: any) {
            toast.error(intl.formatMessage({ id: "Failed to add contact. Please try again." }));
        } finally {
            setIsSubmitting(false);
            setShowAddContact(false);
        }
    };

    return (
        <>
            <button className="bg-azure hover:bg-azure/70 text-white font-medium flex items-center justify-center gap-2 py-2 rounded-md
             cursor-pointer w-fit xs:w-full mx-auto px-2 xs:px-0 text-base xs:text-sm"
                onClick={() => {
                    if (!isAuthenticated) {
                        toast.error(intl.formatMessage({ id: "login-to-add-contact", defaultMessage: "Please login to add a contact" }));
                        return;
                    }
                    setShowAddContact(true);
                }}>
                <UserPlus className="h-5 w-5" />
                <span className="inline-block text-sm sm:text-base whitespace-nowrap">
                    <FormattedMessage id="add-contact" defaultMessage="Add Contact" />
                </span>
            </button>
            {showAddContact && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-background rounded-lg max-w-md w-full">
                        <div className="rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">
                                    <FormattedMessage id="add-contact" />
                                </h3>
                                <button onClick={() => setShowAddContact(false)} className="text-gray-500 cursor-pointer" aria-label="Close form">
                                    <X size={20} />
                                </button>
                            </div>
                            <Form {...form} >
                                <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                                                    "w-full ps-3 text-left font-normal border-gray-200 dark:border-azure text-gray-400 dark:text-azure",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? format(field.value, "yyyy-MM-dd") : <span>Pick a date</span>}
                                                                <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
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

                                    <div className="flex justify-end gap-2">
                                        <Button type="button" variant="outline" onClick={() => setShowAddContact(false)} disabled={isSubmitting}>
                                            <FormattedMessage id="cancel" />
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <FormattedMessage id="adding-contact" />
                                            ) : (
                                                <FormattedMessage id="add-contact" />
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddContactButton;