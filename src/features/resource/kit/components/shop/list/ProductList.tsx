'use client'

import React, { useState } from 'react'
import HeroSection from './ProductHero'
import FilterSection from './ProductFilter'
import { products } from './mockData'
import StatsSection from './ProductStats'
import RichResources from './LinkingResource'
import ProductsGrid from '@/features/resource/kit/components/shop/list/ProductGrid'
import ProductFilterSidebar from '@/features/resource/kit/components/shop/list/ProductFilterSidebar'

const ProductList: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))]

  const filteredProducts = activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory)

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-white'>
      <div className='pb-32'>
        <HeroSection />

        <div className='mx-auto mt-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col gap-8 md:flex-row'>
            {/* Sidebar filter */}
            <div className='w-full shrink-0 md:w-72'>
              <ProductFilterSidebar className='hidden rounded-xl border border-gray-300 shadow-md md:block' />
            </div>

            {/* Products grid */}
            <div className='flex-1'>
              {/* <FilterSection
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              /> */}
              <div className='lg:overflow-y-auto'>
                <ProductsGrid products={filteredProducts} />
              </div>
              {/* <RichResources /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductList
