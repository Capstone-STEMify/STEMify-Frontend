'use client'
import React from 'react'
import ProductGallery from './ProductGallery '
import ProductInfo from './ProductInfo'
import SoftwareSupport from './ProductSupport'
import WhatsIncluded from './ProductConstituent'
import BackButton from '@/components/shared/button/BackButton'
import { useParams } from 'next/navigation'
import { useGetKitByIdQuery } from '@/features/resource/kit/api/kitProductApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import ProductReviews from '@/features/resource/kit/components/shop/details/ProductReviews'

const ProductDetails: React.FC = () => {
  const { kitProductId } = useParams()
  const { data: kitData, isLoading, error } = useGetKitByIdQuery(Number(kitProductId), { skip: !kitProductId })

  if (isLoading) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }
  if (error) {
    return <p>Error: {(error as any)?.message ?? 'Unknown error'}</p>
  }
  return (
    <div className='min-h-screen bg-sky-50/60'>
      <div className='px-4 py-12 sm:px-6 lg:px-8'>
        <BackButton className='m-4' />

        <div className='mx-auto mb-16 grid max-w-7xl gap-12 lg:grid-cols-2'>
          <ProductGallery
            kitImages={
              kitData?.data?.images.map((img) => img.imageUrl ?? 'images/fallback.png') ?? ['images/fallback.png']
            }
          />
          <div className='lg:pr-4'>{kitData && <ProductInfo kit={kitData.data} />}</div>
        </div>

        <div className='space-y-8'>
          <SoftwareSupport />
          <WhatsIncluded name={kitData?.data?.name ?? ''} components={kitData?.data?.components ?? []} />
          {/* <ProductReviews /> */}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
