"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface ComboboxOption {
    value: string
    label: string
}

interface MultiComboboxProps {
    options: ComboboxOption[]
    value?: string | string[]
    onValueChange?: (value: string | string[]) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    multiple?: boolean
    className?: string
    disabled?: boolean
}

export function MultiCombobox({
    options,
    value,
    onValueChange,
    placeholder = "Select option...",
    searchPlaceholder = "Search options...",
    emptyMessage = "No options found.",
    multiple = false,
    className,
    disabled = false,
}: MultiComboboxProps) {
    const [open, setOpen] = React.useState(false)

    // Normalize value to always work with arrays internally
    const selectedValues = React.useMemo(() => {
        if (multiple) {
            return Array.isArray(value) ? value : []
        }
        return typeof value === "string" ? [value] : []
    }, [value, multiple])

    const handleSelect = (optionValue: string) => {
        if (multiple) {
            const newValues = selectedValues.includes(optionValue)
                ? selectedValues.filter((v) => v !== optionValue)
                : [...selectedValues, optionValue]
            onValueChange?.(newValues)
        } else {
            const newValue = selectedValues.includes(optionValue) ? "" : optionValue
            onValueChange?.(newValue)
            setOpen(false)
        }
    }

    const handleRemove = (optionValue: string) => {
        if (multiple) {
            const newValues = selectedValues.filter((v) => v !== optionValue)
            onValueChange?.(newValues)
        }
    }

    const getDisplayText = () => {
        if (selectedValues.length === 0) {
            return placeholder
        }

        if (multiple) {
            return `${selectedValues.length} selected`
        }

        const selectedOption = options.find((option) => option.value === selectedValues[0])
        return selectedOption?.label || placeholder
    }

    const getSelectedLabels = () => {
        return selectedValues
            .map((val) => options.find((option) => option.value === val)?.label)
            .filter(Boolean) as string[]
    }

    return (
        <div className={cn("w-full", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full ps-3 justify-start font-normal border-gray-200 dark:border-azure text-gray-400 dark:text-azure"
                        disabled={disabled}
                    >
                        <span className="truncate">{getDisplayText()}</span>
                        <ChevronsUpDown className="ms-auto h-4 w-4 text-gray-400 dark:text-azure" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} className="h-9" />
                        <CommandList>
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                                        {option.label}
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                selectedValues.includes(option.value) ? "opacity-100" : "opacity-0",
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Render badges for multiple selection */}
            {multiple && selectedValues.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {getSelectedLabels().map((label, index) => {
                        const optionValue = selectedValues[index]
                        return (
                            <Badge key={optionValue} variant="secondary" className="flex items-center gap-1">
                                {label}
                                <button
                                    type="button"
                                    onClick={() => handleRemove(optionValue)}
                                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    aria-label={`Remove ${label}`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
