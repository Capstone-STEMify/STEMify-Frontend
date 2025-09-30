'use client'
import React from 'react'
import ProductGallery from './gallery/ProductGallery '
import ProductInfo from './info/ProductInfo'
import SoftwareSupport from './support/ProductSupport'
import WhatsIncluded from './constituent/ProductConstituent'

const ProductDetails: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'>
      <div className='px-4 py-12 sm:px-6 lg:px-8'>
        <div className='mx-auto mb-16 grid max-w-7xl gap-12 lg:grid-cols-2'>
          <ProductGallery />
          <div className='scrollbar-hidden lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-4'>
            <ProductInfo />
          </div>
        </div>

        <div className='space-y-8'>
          <SoftwareSupport />
          <WhatsIncluded />
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
