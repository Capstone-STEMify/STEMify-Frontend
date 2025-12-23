import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Kit } from '@/features/resource/kit/types/kit.type'
import { useTranslations } from 'next-intl'

const ProductCard: React.FC<{ product: Kit; index: number }> = ({ product, index }) => {
  const t = useTranslations('kits')
  const tc = useTranslations('common')
  const [isHovered, setIsHovered] = useState(false)

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
      </div>
    </motion.div>
  )
}

export default ProductCard
