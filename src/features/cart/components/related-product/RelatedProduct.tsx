'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { Kit } from '@/features/resource/kit/types/kit.type';
import ProductCard from '@/features/resource/kit/components/shop/list/ProductCard'; 

interface RelatedProductsCarouselProps {
  title?: string;
  products: Kit[];
}

export const RelatedProductsCarousel: React.FC<RelatedProductsCarouselProps> = ({
  title = 'Related Products',
  products,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      skipSnaps: false,
      dragFree: true,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-semibold text-gray-900"
          >
            {title}
          </motion.h2>

          {/* Navigation Buttons */}
          {/* <div className="flex gap-3">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center group"
              aria-label="Previous"
            >
              <svg
                className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollNext}
              className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center group"
              aria-label="Next"
            >
              <svg
                className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div> */}
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 py-8 px-4">
            {products.map((product, index) => (
              <div
                key={product.id || index}
                className="flex-none w-[280px] md:w-[320px]"
              >
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center"
        >
          <button className="px-6 py-3 bg-white border-2 border-amber-400 hover:bg-amber-400 hover:text-white text-amber-400 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
            View All Products
          </button>
        </motion.div> */}
      </div>
    </div>
  );
};
