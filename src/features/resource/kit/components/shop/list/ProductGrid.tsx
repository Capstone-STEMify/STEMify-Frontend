'use client'
import SEmpty from '@/components/shared/empty/SEmpty'
import { SkeletonCard } from '@/components/shared/skeleton/SkeletonCard'
import { SPagination } from '@/components/shared/SPagination'
import { useSearchKitQuery } from '@/features/resource/kit/api/kitProductApi'
import { ProductData } from '@/features/resource/kit/components/shop/list/mockData'
import ProductCard from '@/features/resource/kit/components/shop/list/ProductCard'
import { setPageIndex } from '@/features/resource/kit/slice/kitProductSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

const ProductsGrid: React.FC<{ products: ProductData[] }> = ({ products }) => {
  const t = useTranslations('kits')
  const dispatch = useAppDispatch()

  const kitParams = useAppSelector((state) => state.kit)

  // const kitQuery: kitParams = {}
  const { data: kitData, isLoading } = useSearchKitQuery(kitParams)

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  if (isLoading) {
    return (
      <div className='grid h-fit grid-cols-1 justify-items-center gap-y-10 py-10 sm:grid-cols-2 xl:grid-cols-3'>
        <SkeletonCard size='md' />
        <SkeletonCard size='md' />
        <SkeletonCard size='md' />
        <SkeletonCard size='md' />
        <SkeletonCard size='md' />
        <SkeletonCard size='md' />
      </div>
    )
  }

  if (!kitData || kitData.data.items.length === 0) {
    return <SEmpty title={t('list.noData')} description={t('list.noDataDescription')} />
  }

  return (
    <div>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className='mx-auto mb-16 max-w-7xl px-4 sm:px-6'
      >
        <div className='grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3'>
          {kitData.data.items.map((product, index) => (
            <Link href={`/shop/${product.id}`} key={product.id}>
              <ProductCard key={product.id} product={product} index={index} />
            </Link>
          ))}
        </div>
      </motion.section>
      {kitData.data.totalPages > 1 && (
        <SPagination
          pageNumber={kitParams.pageNumber}
          totalPages={kitData.data.totalPages}
          onPageChanged={handlePageChange}
        />
      )}
    </div>
  )
}

export default ProductsGrid
