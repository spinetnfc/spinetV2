import { Store } from 'lucide-react';
import React from 'react';
import useTranslate from '@/hooks/use-translate';
import CtaButton from '../cta-button';
import Legend from '../legend';
import ProductCard from './product-card';
import product1 from '@/assets/images/products/product1.png';
import product2 from '@/assets/images/products/product2.png';
import product3 from '@/assets/images/products/product3.png';

type Props = { locale: string };

async function Products({ locale }: Props) {
  const { t } = await useTranslate(locale);
  const products = [
    {
      imageUrl: product1,
      title: 'spinet-keychain',
      price: '2300 DA',
    },
    {
      imageUrl: product2,
      title: 'spinet-business-card',
      price: '3000 DA',
    },
    {
      imageUrl: product3,
      title: 'spinet-kid-band',
      price: '1500 DA',
    },
  ];

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 px-4 py-12 lg:gap-8 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col items-center gap-4 text-center max-w-4xl mx-auto">
        <Legend text={t('elevate-your-business')} locale={locale} />
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-spinet-deep dark:text-spinet-light">
          {t('most-popular-products')}
        </h2>
        <p className="text-lg sm:text-xl text-spinet-text-muted max-w-2xl">
          {t('most-popular-products-text')}
        </p>
      </div>

      {/* CTA Button */}
      <CtaButton
        icon={<Store className="ms-2.5 size-6" />}
        text={t('go-to-store')}
        className="w-fit text-base xs:text-xl px-6 py-3"
        iconposition="right"
        link="/shop"
      />

      {/* Products Grid */}
      <div className="mt-8 flex h-fit w-full max-w-7xl flex-col items-center justify-center gap-6 lg:flex-row lg:gap-8">
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
