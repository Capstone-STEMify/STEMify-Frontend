import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
export interface ProductGalleryProps {
  kitImages: string[]
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ kitImages }) => {
  const t = useTranslations('kits')
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % kitImages.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + kitImages.length) % kitImages.length)

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className='sticky top-8'
    >
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-slate-300 shadow-2xl'>
        <div className='relative aspect-square'>
          <motion.img
            key={currentImage}
            src={kitImages[currentImage]}
            alt='Product'
            className='h-full w-full object-cover'
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          <button
            onClick={prevImage}
            className='absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white'
          >
            <ChevronLeft className='h-6 w-6' />
          </button>

          <button
            onClick={nextImage}
            className='absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white'
          >
            <ChevronRight className='h-6 w-6' />
          </button>

          <button className='absolute top-4 right-4 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white'>
            <Heart className='h-6 w-6 text-rose-500' />
          </button>
        </div>

        <div className='flex justify-center gap-3 p-6'>
          {kitImages.map((img, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`h-20 w-20 overflow-hidden rounded-xl border-3 transition-all ${
                currentImage === idx ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-200'
              }`}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} className='h-full w-full object-cover' />
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className='mt-8 border-t border-gray-200 pt-4'
      >
        <div className='mb-4 grid grid-cols-4 gap-4'>
          {[
            {
              icon: (
                <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <rect
                    x='3'
                    y='6'
                    width='18'
                    height='12'
                    rx='2'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <line x1='3' y1='10' x2='21' y2='10' strokeWidth='1.5' strokeLinecap='round' />
                </svg>
              ),
              text: t('detail.securePayment')
            },
            {
              icon: (
                <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              ),
              text: t('detail.warranty')
            },
            {
              icon: (
                <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <rect
                    x='1'
                    y='3'
                    width='15'
                    height='13'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M16 8a4 4 0 0 1 8 0v8h-8V8z'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <circle cx='5.5' cy='18.5' r='2.5' strokeWidth='1.5' />
                  <circle cx='18.5' cy='18.5' r='2.5' strokeWidth='1.5' />
                </svg>
              ),
              text: t('detail.freeShipping')
            },
            {
              icon: (
                <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <circle cx='12' cy='12' r='10' strokeWidth='1.5' />
                  <path d='M12 6v6l4 2' strokeWidth='1.5' strokeLinecap='round' />
                  <path d='M16.24 7.76l-1.41 1.41M7.76 16.24l1.41-1.41' strokeWidth='1.5' strokeLinecap='round' />
                </svg>
              ),
              text: t('detail.returnRefund')
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + idx * 0.1 }}
              className='flex flex-col items-center text-center'
            >
              <div className='mb-3 text-gray-400'>{feature.icon}</div>
              <span className='text-sm leading-tight font-semibold text-gray-700'>{feature.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className='flex cursor-pointer items-center justify-center gap-2 border-t border-gray-200 pt-6 text-blue-500 transition-colors hover:text-blue-600'
        >
          <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
            />
          </svg>
          <span className='text-sm font-medium'>{t('detail.productQuestions')}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default ProductGallery
