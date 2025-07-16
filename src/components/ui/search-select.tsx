"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export interface SearchOption {
    value: string;
    label: string;
}

interface SearchSelectProps {
    options: SearchOption[];
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    searchPlaceholder?: string;
    emptyMessage?: string;
    multiple?: boolean;
    className?: string;
    disabled?: boolean;
}

export function SearchSelect({
    options,
    value,
    onValueChange,
    searchPlaceholder = "Search options...",
    emptyMessage = "No options found.",
    multiple = false,
    className,
    disabled = false,
}: SearchSelectProps) {
    const [searchTerm, setSearchTerm] = React.useState("");

    // Normalize value to always work with arrays internally
    const selectedValues = React.useMemo(() => {
        if (multiple) {
            return Array.isArray(value) ? value : [];
        }
        return typeof value === "string" ? [value] : [];
    }, [value, multiple]);

    // Filter options based on search term using label
    const filteredOptions = React.useMemo(() => {
        if (!searchTerm) return options;
        return options.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    const handleSelect = (selectedLabel: string) => {
        // Find the option by label to get the corresponding value
        const selectedOption = options.find((option) => option.label === selectedLabel);
        if (!selectedOption) return;

        const optionValue = selectedOption.value;
        if (multiple) {
            const newValues = selectedValues.includes(optionValue)
                ? selectedValues.filter((v) => v !== optionValue)
                : [...selectedValues, optionValue];
            onValueChange?.(newValues);
        } else {
            const newValue = selectedValues.includes(optionValue) ? "" : optionValue;
            onValueChange?.(newValue);
        }
    };

    const handleRemove = (optionValue: string) => {
        if (multiple) {
            const newValues = selectedValues.filter((v) => v !== optionValue);
            onValueChange?.(newValues);
        }
    };

    const handleUnselectAll = () => {
        if (multiple) {
            onValueChange?.([]);
        } else {
            onValueChange?.("");
        }
    };

    const getSelectedLabels = () => {
        return selectedValues
            .map((val) => options.find((option) => option.value === val)?.label)
            .filter(Boolean) as string[];
    };

    return (
        <div className={cn("w-full", className)}>
            <Command shouldFilter={false}>
                <CommandInput
                    placeholder={searchPlaceholder}
                    className="h-9"
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    disabled={disabled}
                />
                <CommandList>
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup>
                        {multiple && selectedValues.length > 0 && (
                            <CommandItem
                                value="unselect-all"
                                onSelect={() => handleUnselectAll()}
                                className="cursor-pointer bg-red-300 hover:bg-red-400"
                            >
                                Unselect All
                            </CommandItem>
                        )}
                        {filteredOptions.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.label}
                                onSelect={handleSelect}
                            >
                                {option.label}
                                <Check
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
            {multiple && selectedValues.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {getSelectedLabels().map((label, index) => {
                        const optionValue = selectedValues[index];
                        return (
                            <Badge key={optionValue} variant="secondary" className="flex items-center gap-1 bg-gray-200 dark:bg-navy">
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
                        );
                    })}
                </div>
            )}
        </div>
    );
}