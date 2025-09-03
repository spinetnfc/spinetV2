"use client"

import { Search, Plus, Filter, ChevronDown, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ContactSourceFilter } from "./contact-source-filter"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import ImportContacts from "../import-contacts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GoogleIcon, ImportIcon } from "@/app/[locale]/(protected)/app/contacts/add-contact/page"
import { useState } from "react"

interface ContactsHeaderProps {
  contactsCount: number
  onAdvancedFiltersClick: () => void
  setContactSources: (sources: string[]) => void
  setIsColumnModalOpen: (open: boolean) => void
  searchQuery: string
  onSearchChange: (value: string) => void
  setIsExportModalOpen: (open: boolean) => void
}

const UndoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7V13H9" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M21 17C21 14.6131 20.0518 12.3239 18.364 10.636C16.6761 8.94821 14.3869 8 12 8C9.78512 8.00226 7.64885 8.82116 6 10.3L3 13"
      stroke="#111827"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function ContactsHeader({
  contactsCount,
  onAdvancedFiltersClick,
  setContactSources,
  setIsColumnModalOpen,
  searchQuery,
  onSearchChange,
  setIsExportModalOpen,
}: ContactsHeaderProps) {
  const router = useRouter()
  const [importSource, setImportSource] = useState<"file" | "google" | "phone" | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex lg:pl-0  pl-12 items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
          <Badge className="text-sm text-blue-400 bg-blue-100 rounded-2xl hover:bg-blue-100 font-medium">
            {contactsCount}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search contact, title..."
              className="pl-10 rounded-2xl w-full"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 bg-transparent border-primary px-4 py-2">
                    <Upload className="h-4 w-4" />
                    <span  >Import</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="min-w-56 pl-6"
                      onClick={() => {
                        setImportSource("file")
                        setDialogOpen(true)
                      }}
                    >
                      <ImportIcon /> Import from file
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="min-w-56 pl-6"
                      onClick={() => {
                        setImportSource("google")
                        setDialogOpen(true)
                      }}
                    >
                      <GoogleIcon /> Import from Google
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DialogTitle></DialogTitle>
                <DialogContent className="max-w-3xl">
                  {importSource && <ImportContacts source={importSource} />}
                </DialogContent>
              </Dialog>
            </div>

            <Button
              className="bg-blue-600 hover:bg-blue-300 w-full sm:w-auto max-w-48"
              onClick={() => router.replace("/app/contacts/add-contact")}
            >
              <Plus className="w-4 h-4 mr-2" />
              <span  >Add contact</span>
             </Button>
          </div>
        </div>
      </div>

      <div className="flex    justify-between  items-center gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-none hover:bg-blue-100 hidden   bg-transparent shadow-none"
          >
            Contact owner <ChevronDown size={18} />
          </Button>
          <ContactSourceFilter handleContactSource={setContactSources} />
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 bg-transparent border-none hover:bg-blue-100 shadow-none"
            onClick={onAdvancedFiltersClick}
          >
            <Filter className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Advanced filters</span>
            <span className="sm:hidden">Filters</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Button variant="outline" size="sm" className="border-none hover:bg-blue-100 bg-transparent">
            <UndoIcon />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[1px] border-primary hover:bg-blue-100 bg-transparent"
            onClick={() => setIsExportModalOpen(true)}
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[1px] border-primary hover:bg-blue-100 bg-transparent hidden lg:block"
            onClick={() => setIsColumnModalOpen(true)}
          >
            <span className="hidden xl:inline">Modify columns</span>
            <span className="xl:hidden">Columns</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
