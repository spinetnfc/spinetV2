"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X, GripVertical } from "lucide-react"
import { cn } from '@/utils/cn'

interface ColumnConfig {
  id: string
  label: string
  category: "primary" | "more"
  required?: boolean
}

interface ColumnCustomizationModalProps {
  isOpen: boolean
  onClose: () => void
  availableColumns: ColumnConfig[]
  visibleColumns: string[]
  columnOrder: string[]
  onSave: (visibleColumns: string[], columnOrder: string[]) => void
}

export function ColumnCustomizationModal({
  isOpen,
  onClose,
  availableColumns,
  visibleColumns,
  columnOrder,
  onSave,
}: ColumnCustomizationModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(visibleColumns)
  const [orderedColumns, setOrderedColumns] = useState<string[]>(columnOrder)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setSelectedColumns(visibleColumns)
      setOrderedColumns(columnOrder)
    }
  }, [isOpen, visibleColumns, columnOrder])

  if (!isOpen) return null

  const handleColumnToggle = (columnId: string) => {
    const column = availableColumns.find((col) => col.id === columnId)
    if (column?.required) return // Don't allow toggling required columns

    setSelectedColumns((prev) => {
      const isCurrentlySelected = prev.includes(columnId)

      if (isCurrentlySelected) {
        // Remove from selected columns
        const newSelected = prev.filter((id) => id !== columnId)
        // Also remove from ordered columns
        setOrderedColumns((current) => current.filter((id) => id !== columnId))
        return newSelected
      } else {
        // Add to selected columns
        const newSelected = [...prev, columnId]
        // Add to ordered columns only if not already present
        setOrderedColumns((current) => {
          if (!current.includes(columnId)) {
            return [...current, columnId]
          }
          return current
        })
        return newSelected
      }
    })
  }

  const handleRemoveColumn = (columnId: string) => {
    const column = availableColumns.find((col) => col.id === columnId)
    if (column?.required) return // Don't allow removing required columns

    setSelectedColumns((prev) => prev.filter((id) => id !== columnId))
    setOrderedColumns((prev) => prev.filter((id) => id !== columnId))
  }

  const handleDragStart = (columnId: string) => {
    setDraggedItem(columnId)
  }

  const handleDragOver = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetColumnId) return

    const draggedIndex = orderedColumns.indexOf(draggedItem)
    const targetIndex = orderedColumns.indexOf(targetColumnId)

    const newOrder = [...orderedColumns]
    newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, draggedItem)

    setOrderedColumns(newOrder)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleSave = () => {
    // onSave(selectedColumns, orderedColumns)
    onClose()
  }

  const selectedColumnsData = orderedColumns
    .filter((id) => selectedColumns.includes(id))
    .map((id) => availableColumns.find((col) => col.id === id))
    .filter(Boolean)

  const primaryColumns = availableColumns.filter((col) => col.category === "primary")
  const moreColumns = availableColumns.filter((col) => col.category === "more")

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Customize Columns</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex h-[500px]">
          {/* Left side - Selected columns */}
          <div className="w-1/2 p-4 border-r">
            <h3 className="font-medium mb-4">Columns selected ({selectedColumnsData.length})</h3>
            <div className="space-y-2">
              {selectedColumnsData.map((column) => (
                <div
                  key={column!.id}
                  draggable={!column!.required}
                  onDragStart={() => handleDragStart(column!.id)}
                  onDragOver={(e) => handleDragOver(e, column!.id)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded",
                    !column!.required && "cursor-move hover:bg-gray-100 dark:hover:bg-gray-600",
                  )}
                >
                  {!column!.required && <GripVertical className="h-4 w-4 text-gray-400" />}
                  <span className="flex-1">{column!.label}</span>
                  {!column!.required && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveColumn(column!.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Available columns */}
          <div className="w-1/2 p-4">
            {/* Primary columns */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Primary</h3>
              <div className="space-y-2">
                {primaryColumns.map((column) => (
                  <div key={column.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedColumns.includes(column.id)}
                      onCheckedChange={() => handleColumnToggle(column.id)}
                      disabled={column.required}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{column.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* More columns */}
            <div>
              <h3 className="font-medium mb-3">More</h3>
              <div className="space-y-2">
                {moreColumns.map((column) => (
                  <div key={column.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedColumns.includes(column.id)}
                      onCheckedChange={() => handleColumnToggle(column.id)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{column.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </div>
    </div>
  )
}
