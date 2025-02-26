export interface Product {
    id: number
    name: string
    price: number
    image: string
    type: "new-arrival" | "promotion" | "top-selling"
    color: string
    size: string
}

export const MOCK_PRODUCTS: Product[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Spinet Keychain ${i + 1}`,
    price: 2500,
    image: "",
    type: i % 3 === 0 ? "new-arrival" : i % 3 === 1 ? "promotion" : "top-selling",
    color: ["black", "white", "red"][i % 3],
    size: ["S", "M", "L"][i % 3],
}))

export const COLORS = [
    { value: "white", label: "White", class: "bg-white" },
    { value: "red", label: "Red", class: "bg-red-500" },
    { value: "blue", label: "Blue", class: "bg-blue-500" },
    { value: "green", label: "Green", class: "bg-green-500" },
    { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
    { value: "purple", label: "Purple", class: "bg-purple-500" },
    { value: "pink", label: "Pink", class: "bg-pink-500" },
    { value: "black", label: "Black", class: "bg-black" },
]

export const SIZES = ["XS", "S", "M", "L", "XL", "2XL"]

export const CATEGORIES = ["new-arrivals", "promotion", "top-selling", "casual", "sports", "formal"]

export const ITEMS_PER_PAGE = 9

