"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lead } from "@/types/leads";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "sonner";

type LeadStatus = | "pending" | "prospecting" | "offer-sent" | "negotiation" | "administrative-validation" | "done" | "failed" | "canceled"

interface UpdateLeadStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lead: Lead & { status: LeadStatus };
    onStatusUpdated?: (newStatus: LeadStatus) => void;
}

export const UpdateLeadStatusDialog: React.FC<UpdateLeadStatusDialogProps> = ({ open, onOpenChange, lead, onStatusUpdated }) => {
    const intl = useIntl();
    const [status, setStatus] = useState<LeadStatus>(lead.status || "pending");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Mock update lead status - replace with hardcoded behavior
            console.log("Mock update lead status:", lead._id, status);
            toast.success(intl.formatMessage({ id: "Lead status updated successfully", defaultMessage: "Lead status updated successfully" }));
            onOpenChange(false);
            onStatusUpdated?.(status);
        } catch (error: any) {
            toast.error(error.message || intl.formatMessage({ id: "Failed to update status" }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>
                    <FormattedMessage id="edit-status" defaultMessage="Edit Status" />
                </DialogTitle>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select
                        value={status}
                        onValueChange={(value: LeadStatus) => setStatus(value)}
                        disabled={isSubmitting}
                    >
                        <SelectTrigger className="w-full border-gray-200 dark:border-azure text-gray-400 dark:text-azure">
                            <SelectValue placeholder={intl.formatMessage({ id: "status-placeholder" })} />
                        </SelectTrigger>
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
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            <FormattedMessage id="cancel" />
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <FormattedMessage id="saving" /> : <FormattedMessage id="save" />}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
