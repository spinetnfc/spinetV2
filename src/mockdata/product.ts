export interface Product {
    id: string;
    name: string;
    price: number;
    rating: number;
    image: string;
    description: string;
    details: string[];
    colors: string[];
    sizes: string[];
}

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Spinet keychain",
        price: 2500,
        rating: 4.5,
        image: "/img/spinet-keychain.png",
        description:
            "Lorem ipsum dolor sit amet consectetur. Ornare ac scelerisque eros et. Eget quisque viverra mollis justo.",
        details: [
            "Spins is a way to share information from social media, phone numbers, etc...",
            "You can share your profile with a simple tap using NFC.",
            "You can easily store your data, making it accessible with just one scan.",
            "It’s easy to set up, even easier to share.",
            // ... add as many bullet points as needed
        ],
        colors: ["#87f6e3", "#123456", "#987654", "#a156f6"],
        sizes: ["Small", "Medium", "Large"],
    },
    // ... More products if needed
];

export function getProductById(id: string): Product | null {
    return MOCK_PRODUCTS.find((p) => p.id === id) || null;
}

export function getRelatedProducts(id: string): Product[] {
    // For demo, return the same array minus the current product
    return MOCK_PRODUCTS.filter((p) => p.id !== id).slice(0, 4);
}
