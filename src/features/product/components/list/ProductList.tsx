'use client'

import React, { useState } from 'react'
import HeroSection from './hero/ProductHero'
import FilterSection from './filter/ProductFilter'
import ProductsGrid from './grid/ProductGrid'
import { products } from './mockData'
import StatsSection from './stats/ProductStats'
import RichResources from './link-resource/LinkingResource'

const ProductList: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))]

  const filteredProducts = activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory)

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className='pb-12'>
        <HeroSection />
        <FilterSection categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <ProductsGrid products={filteredProducts} />
        {/* <RichResources /> */}
      </div>
    </div>
  )
}

export default ProductList
