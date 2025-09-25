import { Check, X, Circle } from "lucide-react"
import { cn } from '@/utils/cn'

export interface StatusBadgeProps {
  status:
  "pending" | "prospecting" | "offer-sent" | "negotiation" | "administrative-validation" | "done" | "failed" | "canceled" | undefined;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "done":
        return {
          icon: Check,
          text: "done",
          className: "text-[#16A34A] bg-[#F0FDF4]",
        }
      case "failed":
        return {
          icon: X,
          text: status,
          className: "text-[#EF4444] bg-[#FEF2F2]",
        }
      case "canceled":
        return {
          icon: X,
          text: status,
          className: "text-[#EF4444] bg-[#FEF2F2]",
        }
      case "pending":
        return {
          icon: Circle,
          text: status,
          className: "text-[#EAB308] bg-[#FEFCE8] ",
        }
      case "prospecting":
      case "offer-sent":
      case "negotiation":
      case "administrative-validation":
      default:
        return {
          icon: Circle,
          text: status === "prospecting" ? "prospection" : status,
          className: "text-amber-600",
        }
    }
  }

  const config = getStatusConfig(status || "pending")
  const Icon = config.icon

  return (
    <div className={cn("flex items-center gap-2 text-sm w-fit px-2 py-1 rounded", config.className)}>
      <Icon className="w-4 h-4" fill="currentColor" />
      <span>{config.text}</span>
    </div>
  )
}
