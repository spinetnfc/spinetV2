'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
    className?: string;
}

const DEFAULT_COLORS = [
    '#0F62FE', // Blue
    '#FF3D00', // Red
    '#4CAF50', // Green
    '#FFC107', // Yellow
    '#9C27B0', // Purple
    '#795548', // Brown
    '#607D8B', // Gray-Blue
    '#E91E63', // Pink
    '#00BCD4', // Cyan
    '#FF9800', // Orange
];

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState(color);
    const [customColor, setCustomColor] = useState(color);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Update internal state when the color prop changes
        setSelectedColor(color);
        setCustomColor(color);
    }, [color]);

    useEffect(() => {
        // Close the picker when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        setCustomColor(color);
        onChange(color);
        setIsOpen(false);
    };

    const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setCustomColor(newColor);
        setSelectedColor(newColor);
        onChange(newColor);
    };

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setCustomColor(newColor);

        // Check if the input is a valid hex color
        if (/^#([0-9A-F]{3}){1,2}$/i.test(newColor)) {
            setSelectedColor(newColor);
            onChange(newColor);
        }
    };

    return (
        <div className={cn("relative w-full", className)} ref={pickerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-3 py-2 border rounded-md text-sm"
            >
                <span className="flex items-center gap-2">
                    <span
                        className="w-5 h-5 rounded-full border"
                        style={{ backgroundColor: selectedColor }}
                    />
                    {selectedColor}
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 p-3 bg-white dark:bg-gray-800 rounded-md shadow-lg border w-full">
                    <div className="grid grid-cols-5 gap-2 mb-3">
                        {DEFAULT_COLORS.map((colorOption) => (
                            <button
                                key={colorOption}
                                type="button"
                                className={cn(
                                    "w-8 h-8 rounded-full border-2",
                                    colorOption === selectedColor ? "border-black dark:border-white" : "border-transparent"
                                )}
                                style={{ backgroundColor: colorOption }}
                                onClick={() => handleColorSelect(colorOption)}
                            />
                        ))}
                    </div>

                    <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                            <input
                                type="color"
                                value={customColor}
                                onChange={handleCustomColorChange}
                                className="w-8 h-8"
                            />
                            <input
                                type="text"
                                value={customColor}
                                onChange={handleTextInputChange}
                                className="flex-1 px-2 py-1 text-sm border rounded"
                                placeholder="#RRGGBB"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 