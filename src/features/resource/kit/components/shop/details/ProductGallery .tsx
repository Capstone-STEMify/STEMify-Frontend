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
    </motion.div>
  )
}

export default ProductGallery
