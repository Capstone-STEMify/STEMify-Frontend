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
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className='pb-12'>
        <HeroSection />
        <div className='mx-auto mt-15 w-full px-20'>
          <div className='flex gap-2'>
            {/* Sidebar filter */}
            <div className='w-85 shrink-0'>
              <ProductFilterSidebar />
            </div>

            {/* Products grid */}
            <div className='flex-1'>
              {/* <FilterSection categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} /> */}
              <ProductsGrid products={filteredProducts} />
              {/* <RichResources /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductList
