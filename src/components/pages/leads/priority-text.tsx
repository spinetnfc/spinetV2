import { cn } from "@/lib/utils"
import { Priority } from "@/types/leads"
 
interface PriorityTextProps {
  priority: Priority
  className?: string
}

export function PriorityText({ priority, className }: PriorityTextProps) {
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "critical":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  // return <span className={cn(getPriorityColor(priority), "capitalize", className)}>{priority}</span>
    return <span className="text-[#535862] text-sm">{priority}</span>

}
