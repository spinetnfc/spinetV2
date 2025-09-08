import { Lead } from "@/types/leads"

export function getLeadMainContact(lead: Lead): Lead["mainContact"] | undefined {
  return lead.mainContact
}