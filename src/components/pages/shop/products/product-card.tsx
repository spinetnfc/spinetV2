import Image from "next/image";
import imgUrl from "@/mockdata/keychain.png"
import { type Product } from "@/mockdata/products"

function ProductCard({ product }: { product: Product }) {
    return (
        <div className="group rounded-lg border p-4 transition-all hover:shadow-lg">
            <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                    src={product.image || imgUrl}
                    alt={product.name}
                    className="object-cover transition-transform group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                <button className="w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600">Add to Cart</button>
            </div>
        </div>
    )
}

export default ProductCard;