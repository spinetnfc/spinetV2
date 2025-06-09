import { ShoppingCart } from 'lucide-react';
import React from 'react';

import useTranslate from '@/hooks/use-translate';
import Image, { StaticImageData } from 'next/image';

type Product = {
  imageUrl: StaticImageData;
  title: string;
  price: string;
};

type Props = {
  index: number;
  product: Product;
  locale: string;
};

async function ProductCard({ index, product, locale }: Props) {
  const { t } = await useTranslate(locale);
  return (
    <div
      className="group relative m-auto flex h-[433px] w-full flex-col items-center gap-2.5 
      overflow-hidden rounded-[18px] border border-slate-400 px-2 py-4 
      transition-shadow duration-300 hover:cursor-pointer hover:shadow-[0px_9px_19px_rgba(0,0,0,0.69)]
    dark:border-white/10 dark:hover:shadow-[0px_9px_19px_rgba(100,100,100,0.69)] lg:w-[382px]"
    >
      {/* Hover Gradient Blur Effect */}
      <div
        className="absolute bottom-[3.57%]  z-0 size-[300px] 
        bg-[radial-gradient(50%_50%_at_50%_50%,#145FF2_23.44%,rgba(20,95,242,0)_90.92%)] opacity-0 
        blur-2xl 
        transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Price Tag */}
      <div className="relative z-10 w-full text-right text-2xl font-bold text-[#1A3B8E] dark:text-[#8FC8FF]">
        {/* Translate price for arabic */}
        {product.price}
      </div>

      {/* Product Image */}
      <div className="relative z-10 size-[239px] flex-1">
        <Image
          quality={100}
          src={product.imageUrl}
          alt={product.title}
          className="size-full object-cover"
        />
      </div>

      {/* Product Title */}
      <div className="relative z-10 w-[285px] text-center text-2xl font-bold text-[#1A3B8E] dark:text-[#DEE3F8]">
        {t(product.title)}
      </div>

      {/* See in Store / Order Now Button */}
      {index === 0 ? (
        <button className="relative z-10 flex h-[47px] w-[254px] items-center justify-center rounded-[8px] bg-navy text-xl text-white transition-colors duration-300 hover:bg-[#0A2C6C]">
          {t('see-in-store')}
        </button>
      ) : (
        <button className="relative z-10 flex h-[47px] w-[254px] items-center justify-center gap-4 rounded-[8px] bg-navy text-xl text-white transition-colors duration-300 hover:bg-[#0A2C6C]">
          <ShoppingCart className="size-6" />
          {t('order-now')}
        </button>
      )}
    </div>
  );
}

export default ProductCard;
