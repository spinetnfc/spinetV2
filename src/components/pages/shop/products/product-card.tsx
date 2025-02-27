import Image from "next/image";
import imgUrl from "@/mockdata/keychain.png"
import { type Product } from "@/mockdata/products"
import ShopButton from "../shop-button";
import useTranslate from "@/hooks/use-translate";
import { FormattedMessage } from "react-intl";
function ProductCard({ product, locale }: { product: Product, locale: string }) {
    return (
        <div className="group rounded-lg border dark:border-blue-950 p-4 transition-all hover:shadow-lg">
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
                <p className="text-lg md:text-2xl font-semiBold text-blue-500">${product.price.toFixed(2)}</p>
                <ShopButton title={<FormattedMessage id="add-to-cart" />} className="text-sm sm:text-md" />
            </div>
        </div>
    )
}

export default ProductCard;