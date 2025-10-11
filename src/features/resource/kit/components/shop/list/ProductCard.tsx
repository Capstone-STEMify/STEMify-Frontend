import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Kit } from '@/features/resource/kit/types/kit.type'
import { useTranslations } from 'next-intl'

const ProductCard: React.FC<{ product: Kit; index: number }> = ({ product, index }) => {
  const t = useTranslations('kits')
  const tc = useTranslations('common')
  const [isHovered, setIsHovered] = useState(false)

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className='flex items-center'>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${
              star <= Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : star - 0.5 <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-300 text-gray-300'
            }`}
            viewBox='0 0 24 24'
          >
            <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className='group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl'
    >
      <div className='relative aspect-square overflow-hidden bg-gray-100'>
        {/* Image */}
        <motion.img
          src={product.imageUrl || '/images/fallback.png'}
          alt={product.name}
          className='aspect-square w-full rounded-t-2xl object-cover'
          animate={{ opacity: isHovered ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Video Background on Hover */}
        <motion.div
          className='absolute inset-0'
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isHovered && (
            <video autoPlay loop muted playsInline className='h-full w-full object-cover'>
              <source src='https://res.cloudinary.com/dgdi9wvpz/video/upload/1009_1_yfgzqp.mp4' type='video/mp4' />
            </video>
          )}
        </motion.div>

        {/* Overlay Gradient */}
        <motion.div
          className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Category Badge */}
        <div className='absolute top-4 left-4'>
          <span className='text-orange-custom-500 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold backdrop-blur-sm'>
            {t('list.bestSeller')}
          </span>
        </div>

        {/* Quick View Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className='absolute bottom-4 left-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-lg transition hover:bg-gray-100'
        >
          {tc('button.quickView')}
        </motion.button>
      </div>

      {/* Product Info */}
      <div className='p-6 pt-4'>
        <h3 className='text-md mb-1 line-clamp-2 min-h-[3rem] font-bold text-gray-900'>{product.name}</h3>
        <p className='mb-1 line-clamp-2 text-sm text-gray-600'>{product.description}</p>
        <div className='mb-3 flex items-center gap-2'>
          <StarRating rating={5} />
          <span className='text-sm font-medium text-gray-400 drop-shadow-md'>
            {5} ({10})
          </span>
        </div>
        <div className='flex flex-col items-start gap-3'>
          {product.isPreOrder ? (
            <span className='rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600'>
              {t('list.statusOptions.preOrder')}
            </span>
          ) : (
            <span className='text-xl font-bold text-red-600'>{product.price.toLocaleString('en-US')} VND</span>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='flex cursor-pointer items-center gap-2 rounded-full border-1 border-blue-600 bg-white px-3 py-1 text-sm font-semibold text-blue-600 transition hover:bg-blue-50'
          >
            {t('list.addToCart')}
            {/* <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg> */}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
