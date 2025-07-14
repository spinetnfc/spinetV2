"use client"

import React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Lead } from "@/types/leads"
import { FormattedMessage } from "react-intl"

interface EditLeadPanelProps {
    lead: Lead
    onClose: () => void
    onSave?: (updatedLead: Lead) => void
}

export const EditLeadPanel: React.FC<EditLeadPanelProps> = ({ lead, onClose, onSave }) => {
    return (
        <Card className="w-80 h-fit">
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
                <div>
                    <h3 className="font-medium mb-2">{lead.name}</h3>
                    <p className="text-sm text-muted-foreground">
                        <FormattedMessage id="status" defaultMessage="Status" />: {lead.status}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        <FormattedMessage id="priority" defaultMessage="Priority" />: {lead.priority}
                    </p>
                    {lead.mainContact && (
                        <p className="text-sm text-muted-foreground">
                            <FormattedMessage id="main-contact" defaultMessage="Main Contact" />: {
                                typeof lead.mainContact === "string"
                                    ? lead.mainContact
                                    : (lead.mainContact as any).fullName || (lead.mainContact as any).name
                            }
                        </p>
                    )}
                </div>

                {/* Add your edit form fields here */}
                <div className="space-y-2">
                    <Button className="w-full" onClick={() => onSave?.(lead)}>
                        <FormattedMessage id="save-changes" defaultMessage="Save Changes" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}