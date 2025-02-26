"use client"

import { ChevronDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
const CATEGORIES = ["New arrivals", "Promotion", "Top selling", "Pack"]
const PRODUCT_CATEGORIES = ["Card", "Sticker", "Keychain", "Display", "Custom card"]

const COLORS = [
    { value: "green", class: "bg-green-500" },
    { value: "red", class: "bg-red-500" },
    { value: "yellow", class: "bg-yellow-400" },
    { value: "orange", class: "bg-orange-500" },
    { value: "cyan", class: "bg-cyan-400" },
    { value: "blue", class: "bg-blue-500" },
    { value: "purple", class: "bg-purple-500" },
    { value: "pink", class: "bg-pink-500" },
    { value: "white", class: "bg-white border border-gray-200" },
    { value: "black", class: "bg-black" },
]

const SIZES = ["X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large"]

export function ProductsFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isColorsOpen, setIsColorsOpen] = useState(true)
    const [isSizeOpen, setIsSizeOpen] = useState(true)
    const [isCategoryOpen, setIsCategoryOpen] = useState(true)

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        const currentValues = params.getAll(key)

        if (currentValues.includes(value)) {
            const newValues = currentValues.filter((v) => v !== value)
            params.delete(key)
            newValues.forEach((v) => params.append(key, v))
        } else {
            params.append(key, value)
        }

        router.push(`?${params.toString()}`)
    }

    const isChecked = (key: string, value: string) => {
        return searchParams.getAll(key).includes(value)
    }

    const applyFilters = () => {
        // if filters don't apply automatically on change
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => updateFilters("category", category.toLowerCase())}
                            className={cn("block w-full text-left px-2 py-1.5 rounded-md",
                                isChecked("category", category.toLowerCase()) ? "bg-blue-500" :
                                    "hover:bg-gray-200 dark:bg-blue-900"
                            )
                            }
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <button
                    onClick={() => setIsColorsOpen(!isColorsOpen)}
                    className="flex items-center justify-between w-full mb-4"
                >
                    <span className="text-lg font-semibold">Colors</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isColorsOpen ? "transform rotate-180" : ""}`} />
                </button>
                {isColorsOpen && (
                    <div className="grid grid-cols-5 gap-2">
                        {COLORS.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => updateFilters("color", color.value)}
                                className={`w-8 h-8 rounded-full ${color.class} ${isChecked("color", color.value) ? "ring-2 ring-offset-2 ring-blue-500" : ""
                                    }`}
                                title={color.value}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div>
                <button onClick={() => setIsSizeOpen(!isSizeOpen)} className="flex items-center justify-between w-full mb-4">
                    <span className="text-lg font-semibold">Size</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isSizeOpen ? "transform rotate-180" : ""}`} />
                </button>
                {isSizeOpen && (
                    <div className="grid grid-cols-2 gap-2">
                        {SIZES.map((size) => (
                            <button
                                key={size}
                                onClick={() => updateFilters("size", size.toLowerCase())}
                                className={`px-4 py-2 rounded-full text-sm ${isChecked("size", size.toLowerCase()) ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="flex items-center justify-between w-full mb-4"
                >
                    <span className="text-lg font-semibold">Category</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isCategoryOpen ? "transform rotate-180" : ""}`} />
                </button>
                {isCategoryOpen && (
                    <div className="space-y-2">
                        {PRODUCT_CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => updateFilters("productCategory", category.toLowerCase())}
                                className={cn("block w-full text-left px-2 py-1.5 rounded-md",
                                    isChecked("productCategory", category.toLowerCase()) ? "bg-blue-500" :
                                        "hover:bg-gray-200 dark:bg-blue-900"
                                )
                                }
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={applyFilters}
                className="w-full py-3 bg-[#001838] text-white rounded-md hover:bg-[#002857] transition-colors"
            >
                Apply Filter
            </button>
        </div>
    )
}

