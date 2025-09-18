"use client"

import { Search, Plus, Filter, ChevronDown, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ContactSourceFilter } from "./contact-source-filter"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
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
  isLoading: boolean
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

const FilterIcon = () => (
  <span className="inline-flex items-center justify-center text-blue-800">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 16.583H14C14.1105 16.583 14.2168 16.6269 14.2949 16.7051C14.3731 16.7832 14.417 16.8895 14.417 17C14.417 17.1105 14.3731 17.2168 14.2949 17.2949C14.2168 17.3731 14.1105 17.417 14 17.417H10C9.88949 17.417 9.78322 17.3731 9.70508 17.2949C9.62694 17.2168 9.58301 17.1105 9.58301 17C9.58301 16.8895 9.62694 16.7832 9.70508 16.7051C9.78322 16.6269 9.88949 16.583 10 16.583ZM7 11.583H17C17.1105 11.583 17.2168 11.6269 17.2949 11.7051C17.3731 11.7832 17.417 11.8895 17.417 12C17.417 12.1105 17.3731 12.2168 17.2949 12.2949C17.2168 12.3731 17.1105 12.417 17 12.417H7C6.88949 12.417 6.78322 12.3731 6.70508 12.2949C6.62694 12.2168 6.58301 12.1105 6.58301 12C6.58301 11.8895 6.62694 11.7832 6.70508 11.7051C6.78322 11.6269 6.88949 11.583 7 11.583ZM4.5 6.58301H19.5C19.6105 6.58301 19.7168 6.62694 19.7949 6.70508C19.8731 6.78322 19.917 6.88949 19.917 7C19.917 7.11051 19.8731 7.21678 19.7949 7.29492C19.7168 7.37306 19.6105 7.41699 19.5 7.41699H4.5C4.38949 7.41699 4.28322 7.37306 4.20508 7.29492C4.12694 7.21678 4.08301 7.11051 4.08301 7C4.08301 6.88949 4.12694 6.78322 4.20508 6.70508C4.28322 6.62694 4.38949 6.58301 4.5 6.58301Z"
        fill="#2563EB"
        stroke="#2563EB"
        strokeWidth="0.666667"
      />
    </svg>
  </span>
);


export function ContactsHeader({
  contactsCount,
  onAdvancedFiltersClick,
  setContactSources,
  setIsColumnModalOpen,
  searchQuery,
  onSearchChange,
  setIsExportModalOpen,
  isLoading
}: ContactsHeaderProps) {
  const router = useRouter()
  const [importSource, setImportSource] = useState<"file" | "google" | "phone" | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex lg:pl-0  pl-12 items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
          {isLoading ? (
            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
          ) : (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {contactsCount} Contact{contactsCount !== 1 ? "s" : ""}
            </Badge>
          )}
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
                  <DropdownMenuTrigger className="flex items-center gap-2 bg-white border-primary px-4 py-2">
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
                </DialogContent>
              </Dialog>
            </div>

            <Button
              className="bg-blue-600 hover:bg-blue-300 w-full sm:w-auto max-w-48"
              onClick={() => router.replace("/app/contacts/add-contact")}
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Add contact</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex    justify-between  items-center gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-none hover:bg-blue-100 hidden   bg-white shadow-none"
          >
            Contact owner <ChevronDown size={18} />
          </Button>
          <ContactSourceFilter handleContactSource={setContactSources} />
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 bg-white border-none hover:bg-blue-100 hover:text-blue-600 shadow-none"
            onClick={onAdvancedFiltersClick}
          >
            <span className="hidden sm:inline">Advanced filters</span>
            <span className="sm:hidden">Filters</span>
            <FilterIcon />
          </Button>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Button variant="outline" size="sm" className="border-none hover:bg-blue-100 bg-white">
            <UndoIcon />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[1px] border-primary hover:bg-blue-100 bg-white"
            onClick={() => setIsExportModalOpen(true)}
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[1px] border-primary hover:bg-blue-100 bg-white hidden lg:block"
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
