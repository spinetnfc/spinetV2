import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"

interface ContactTableSkeletonProps {
  rowCount?: number
}

export function ContactTableSkeleton({ rowCount = 5 }: ContactTableSkeletonProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table className="table-auto relative">
        <TableHeader className="bg-gray-100 dark:bg-navy">
          <TableRow>
            <TableHead className="px-2 py-1 font-normal w-fit">
              <Checkbox disabled className="opacity-50" />
            </TableHead>
            <TableHead className="px-2 py-1 font-normal">Contact</TableHead>
            <TableHead className="px-2 py-1 font-normal">Source</TableHead>
            <TableHead className="px-2 py-1 font-normal hidden sm:table-cell">Company</TableHead>
            <TableHead className="px-2 py-1 font-normal hidden sm:table-cell">Position</TableHead>
            <TableHead className="w-12 absolute top-1.5 end-4">
              <Skeleton className="h-6 w-6 rounded" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, index) => (
            <TableRow key={index} className="animate-pulse">
              {/* Select checkbox */}
              <TableCell className="w-12 px-2 min-w-0 h-14 max-h-14">
                <Checkbox disabled className="opacity-30" />
              </TableCell>

              {/* Contact name and info */}
              <TableCell className="w-auto truncate px-2 min-w-0 h-14 max-h-14">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </TableCell>

              {/* Source */}
              <TableCell className="truncate px-2 min-w-0 h-14 max-h-14">
                <Skeleton className="h-6 w-16 rounded-full" />
              </TableCell>

              {/* Company - hidden on mobile */}
              <TableCell className="truncate px-2 min-w-0 h-14 max-h-14 hidden sm:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableCell>

              {/* Position - hidden on mobile */}
              <TableCell className="truncate px-2 min-w-0 h-14 max-h-14 hidden sm:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableCell>

              {/* Action buttons */}
              <TableCell className="px-2 w-12">
                <Skeleton className="h-6 w-6 rounded" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={100} className="h-10 px-2 py-1 bg-gray-100 dark:bg-navy">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
