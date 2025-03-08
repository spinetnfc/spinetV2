import { Store } from 'lucide-react';
import React from 'react';

import useTranslate from '@/hooks/use-translate';

import CtaButton from '../cta-button';
import Legend from '../legend';

import ProductCard from './product-card';

type Props = { locale: string };

async function Products({ locale }: Props) {
  const { t } = await useTranslate(locale);
  const products = [
    {
      imageUrl: '/img/products/product1.png',
      title: 'spinet-keychain',
      price: '2300 DA',
    },
    {
      imageUrl: '/img/products/product2.png',
      title: 'spinet-business-card',
      price: '3000 DA',
    },
    {
      imageUrl: '/img/products/product3.png',
      title: 'spinet-kid-band',
      price: '1500 DA',
    },
  ];
  return (
    <div className=" flex w-full flex-col items-center justify-center  gap-2.5   px-3 py-1.5  lg:gap-4">
      <Legend text={t('elevate-your-business')} locale={locale} />
      <div className=" text-center text-4xl sm:text-5xl leading-[60px] text-[#1A3B8E] dark:text-white">
        {t('most-popular-products')}
      </div>

      <div className="flex  items-center justify-center text-center text-lg sm:text-xl  text-[#1A3B8E]/80  dark:text-white">
        {t('most-popular-products-text')}
      </div>

      <CtaButton
        icon={<Store className="ms-2.5 size-6" />}
        text={t('go-to-store')}
        className="w-full max-w-[308px]"
        iconposition="right"
        link="/shop"
      />
      <div className="mt-8 flex h-fit w-full flex-col items-center justify-center gap-2 lg:flex-row">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            index={index}
            product={product}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}

export default Products;
