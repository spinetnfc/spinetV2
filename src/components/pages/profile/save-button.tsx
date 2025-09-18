'use client'

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { FormattedMessage } from "react-intl"

export default function SaveButton({ profileId, sectionName }:
    { profileId: string, sectionName: string }) {
    const [isPending, startTransition] = useTransition()

    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const form = e.currentTarget.closest('form')
        if (!form) return

        const formData = new FormData(form)
        const data: Record<string, string> = {}

        formData.forEach((value, key) => {
            data[key] = value.toString()
        })

        startTransition(async () => {
            try {
                // Mock update - replace with hardcoded behavior
                console.log(`Mock ${sectionName} update:`, data);
                // router.refresh()
                // Show success notification
            } catch (error) {
                console.error(`Error updating ${sectionName}:`, error)
                // Show error notification
            }
        })
    }

    return (
        <Button
            onClick={handleSave}
            disabled={isPending}
        >
            {isPending ? <FormattedMessage id="saving" /> : <FormattedMessage id="save-changes" />}
        </Button>
    )
}