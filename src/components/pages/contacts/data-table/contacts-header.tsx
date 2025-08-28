"use client"

import { Search, Plus, Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ContactSourceFilter } from "./contact-source-filter"

interface ContactsHeaderProps {
  contactsCount: number
  onAdvancedFiltersClick: () => void
   setContactSources: (sources: string[]) => void
}

const undo = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 7V13H9" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 17C21 14.6131 20.0518 12.3239 18.364 10.636C16.6761 8.94821 14.3869 8 12 8C9.78512 8.00226 7.64885 8.82116 6 10.3L3 13" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}


export function ContactsHeader({ contactsCount, onAdvancedFiltersClick ,setContactSources}: ContactsHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
          <Badge className="text-sm text-blue-400 bg-blue-100 rounded-2xl hover:bg-blue-100 font-medium">
            {contactsCount}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search contact, title..." className="pl-10 rounded-2xl" />
          </div>
          <Button variant="outline" size="lg" className="text-blue-600 bg-transparent hover:bg-blue-100">
            Import
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-100">
            <Plus className="w-4 h-4 mr-2" />
            Add contact
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 mb-4">
       <div className="flex items-center gap-2">
        <Button variant="outline" size="sm"  className="border-none hover:bg-blue-100">
          Contact owner <ChevronDown size={18} />
        </Button>
        <ContactSourceFilter handleContactSource={setContactSources} />
        <Button variant="outline" size="sm" className="text-blue-600 bg-transparent border-none hover:bg-blue-100" onClick={onAdvancedFiltersClick}>
          <Filter className="w-4 h-4 mr-2" />
          Advanced filters
        </Button></div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-none hover:bg-blue-100">
              {undo()}
            </Button>
        <Button variant="outline" size="sm" className="border-[1px] border-primary  hover:bg-blue-100">
          Export
        </Button>
        <Button variant="outline" size="sm" className="border-[1px] border-primary hover:bg-blue-100">
          Modify columns
        </Button>
        </div>
      </div>
    </div>
  )
}
