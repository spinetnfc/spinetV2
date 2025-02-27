"use client"

import { ChevronDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { FormattedMessage } from "react-intl"

const CATEGORIES = ["New arrivals", "Promotion", "Top selling", "Pack"]
const PRODUCT_CATEGORIES = ["Card", "Sticker", "Keychain", "Display", "Custom card"]

const COLORS = [
    { value: "green", class: "bg-green-500 border-gray-200" },
    { value: "red", class: "bg-red-500 border-gray-200" },
    { value: "yellow", class: "bg-yellow-400 border-gray-200" },
    { value: "orange", class: "bg-orange-500 border-gray-200" },
    { value: "cyan", class: "bg-cyan-400 border-gray-200" },
    { value: "blue", class: "bg-blue-500 border-gray-200" },
    { value: "purple", class: "bg-purple-500 border-gray-200" },
    { value: "pink", class: "bg-pink-500 border-gray-200" },
    { value: "white", class: "bg-gray-50 border border-gray-200" },
    { value: "black", class: "bg-black border-gray-200" },
]

const SIZES = ["X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large"]

export function ProductsFilters({ locale }: { locale: string }) {
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
        <div className="h-fit space-y-6 md:p-4 md:rounded-2xl md:border dark:border-blue-950">
            <div>
                <h3 className="text-2xl font-semibold px-2 pb-3 mb-3 border-b dark:border-blue-950">
                    <FormattedMessage id="filters" />
                </h3>
                <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => updateFilters("category", category.toLowerCase())}
                            className={cn("block w-full text-start px-2 py-1.5 rounded-md",
                                isChecked("category", category.toLowerCase()) ? "bg-blue-500" :
                                    "hover:bg-gray-200 hover:dark:bg-blue-900"
                            )
                            }
                        >
                            <FormattedMessage id={category.toLowerCase()} />
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <button
                    onClick={() => setIsColorsOpen(!isColorsOpen)}
                    className="flex items-center justify-between w-full pb-3 mb-3 border-b dark:border-blue-950"
                >
                    <span className="text-lg font-semibold">
                        <FormattedMessage id="colors" />
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isColorsOpen ? "transform rotate-180" : ""}`} />
                </button>
                {isColorsOpen && (
                    <div className="grid grid-cols-5 gap-2">
                        {COLORS.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => updateFilters("color", color.value)}
                                className={`w-6 xl:w-8 aspect-square rounded-full cursor-pointer ${color.class} ${isChecked("color", color.value) ? "ring-2 ring-offset-2 ring-blue-500" : ""
                                    }`}
                                title={color.value}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div>
                <button onClick={() => setIsSizeOpen(!isSizeOpen)} className="flex items-center justify-between w-full pb-3 mb-3 border-b dark:border-blue-950">
                    <span className="text-lg font-semibold">
                        <FormattedMessage id="size" />
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isSizeOpen ? "transform rotate-180" : ""}`} />
                </button>
                {isSizeOpen && (
                    <div className="grid grid-cols-2 gap-2">
                        {SIZES.map((size) => (
                            <button
                                key={size}
                                onClick={() => updateFilters("size", size.toLowerCase())}
                                className={cn("px-4 py-2 rounded-full text-sm",
                                    isChecked("size", size.toLowerCase()) ? "bg-blue-500" :
                                        "hover:bg-gray-200 dark:hover:bg-blue-900"
                                )}
                            >
                                <FormattedMessage id={size.toLowerCase()} />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="flex items-center justify-between w-full pb-3 mb-3 border-b dark:border-blue-950"
                >
                    <span className="text-lg font-semibold">
                        <FormattedMessage id="category" />
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isCategoryOpen ? "transform rotate-180" : ""}`} />
                </button>
                {isCategoryOpen && (
                    <div className="space-y-2">
                        {PRODUCT_CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => updateFilters("productCategory", category.toLowerCase())}
                                className={cn("block w-full text-start px-2 py-1.5 rounded-md",
                                    isChecked("productCategory", category.toLowerCase()) ? "bg-blue-500" :
                                        "hover:bg-gray-200 hover:dark:bg-blue-900"
                                )
                                }
                            >
                                <FormattedMessage id={category.toLocaleLowerCase()} />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={applyFilters}
                className="w-full py-3 bg-[#001838] text-white rounded-md hover:bg-[#002857] transition-colors cursor-pointer"
            >
                <FormattedMessage id="apply-filter" />
            </button>
        </div>
    )
}

