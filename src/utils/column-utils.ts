import type { ColumnDef } from "@tanstack/react-table"
import type { Contact } from "@/types/contact"

export function reorderColumns(originalColumns: ColumnDef<Contact>[], columnOrder: string[]): ColumnDef<Contact>[] {
  // Create a map of columns by their id for quick lookup
  const columnMap = new Map<string, ColumnDef<Contact>>()

  originalColumns.forEach((column) => {
    const id = column.id || (column as any).accessorKey
    if (id) {
      columnMap.set(id, column)
    }
  })

  // Reorder columns based on columnOrder array
  const reorderedColumns: ColumnDef<Contact>[] = []

  columnOrder.forEach((columnId) => {
    const column = columnMap.get(columnId)
    if (column) {
      reorderedColumns.push(column)
      columnMap.delete(columnId) // Remove from map to avoid duplicates
    }
  })

  // Add any remaining columns that weren't in the columnOrder array
  columnMap.forEach((column) => {
    reorderedColumns.push(column)
  })

  return reorderedColumns
}
