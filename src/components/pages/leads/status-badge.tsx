import { Badge } from "@/components/ui/badge"
import { Status } from "@/types/leads"
 
interface StatusBadgeProps {
  status: Status
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: Status) => {
    switch (status) {
      case "done":
        return { label: "done", variant: "secondary" as const }
      case "failed":
        return { label: "failed", variant: "destructive" as const }
      case "pending":
        return { label: "pending", variant: "outline" as const }
      case "prospecting":
        return { label: "prospecting", variant: "default" as const }
      default:
        return { label: status, variant: "default" as const }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant={config.variant} className="capitalize">
      {config.label}
    </Badge>
  )
}
