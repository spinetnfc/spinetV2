'use client'

import { Button } from "@/components/ui/button"
import { updateProfile } from "@/lib/api/profile"
// import { useRouter } from "next/router"
import { useTransition } from "react"

export default function SaveButton({ profileId, sectionName }:
    { profileId: string, sectionName: string }) {
    const [isPending, startTransition] = useTransition()
    // const router = useRouter()

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
                await updateProfile(profileId, data)
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
            {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
    )
}