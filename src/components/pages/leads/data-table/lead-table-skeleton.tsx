import type { ColumnDef } from "@tanstack/react-table"

interface TableSkeletonProps<TData> {
  columns: ColumnDef<TData>[]
  showActions: boolean
}

export function TableSkeleton<TData>({ columns, showActions }: TableSkeletonProps<TData>) {
  // Mock skeleton data that matches lead structure
  const skeletonLeadData = [
    {
      name: "John Anderson",
      email: "john.anderson@company.com",
      status: "New",
      priority: "high",
      mainContact: "Sarah Wilson",
      tags: ["Enterprise", "Hot Lead"],
      createdAt: "2024-01-15",
    },
    {
      name: "Maria Rodriguez",
      email: "maria.r@startup.io",
      status: "Contacted",
      priority: "medium",
      mainContact: "Mike Chen",
      tags: ["SMB", "Follow-up"],
      createdAt: "2024-01-14",
    },
    {
      name: "David Thompson",
      email: "d.thompson@enterprise.com",
      status: "Qualified",
      priority: "critical",
      mainContact: "Lisa Park",
      tags: ["Enterprise", "Demo Scheduled", "Priority"],
      createdAt: "2024-01-13",
    },
    {
      name: "Jennifer Kim",
      email: "jen.kim@techcorp.com",
      status: "Proposal Sent",
      priority: "low",
      mainContact: "Alex Johnson",
      tags: ["Mid-market"],
      createdAt: "2024-01-12",
    },
    {
      name: "Robert Martinez",
      email: "r.martinez@solutions.net",
      status: "Negotiation",
      priority: "high",
      mainContact: "Emma Davis",
      tags: ["Enterprise", "Contract Review"],
      createdAt: "2024-01-11",
    },
  ]

  const renderSkeletonCell = (columnKey: string, rowData: any) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        )
      case "email":
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        )
      case "status":
        return (
          <div className="animate-pulse">
            <div className="h-6 bg-blue-100 rounded-full w-20"></div>
          </div>
        )
      case "priority":
        const priorityColors = {
          low: "bg-green-100",
          medium: "bg-yellow-100",
          high: "bg-red-100",
          critical: "bg-purple-100",
        }
        return (
          <div className="animate-pulse">
            <div
              className={`h-6 ${priorityColors[rowData.priority as keyof typeof priorityColors]} rounded-full w-16`}
            ></div>
          </div>
        )
      case "mainContact":
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-28"></div>
          </div>
        )
      case "tags":
        return (
          <div className="flex gap-1 animate-pulse">
            <div className="h-6 bg-gray-100 rounded w-16"></div>
            <div className="h-6 bg-gray-100 rounded w-12"></div>
          </div>
        )
      case "createdAt":
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        )
      default:
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        )
    }
  }

  return (
    <div className="bg-white">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="text-left px-4 py-3 text-sm font-medium text-gray-900">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                ))}
                {showActions && <th className="w-12 px-4 py-3"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {skeletonLeadData.map((rowData, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => {
                    const columnKey = typeof column.id === "string" ? column.id : `col-${colIndex}`
                    return (
                      <td key={colIndex} className="px-4 py-4">
                        {renderSkeletonCell(columnKey, rowData)}
                      </td>
                    )
                  })}
                  {showActions && (
                    <td className="px-4 py-4">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
