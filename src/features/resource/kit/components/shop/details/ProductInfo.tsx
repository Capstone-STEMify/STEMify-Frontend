import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, HandCoins, RotateCcw, Shield, ShoppingCart, Star, Truck, Wallet } from 'lucide-react'
import Image from 'next/image'
import { Kit } from '@/features/resource/kit/types/kit.type'
import { useTranslations } from 'next-intl'
import { useUpdateCartItemsMutation } from '@/features/cart/api/cartApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { toast } from 'sonner'
export interface ProductInfoProps {
  kit: Kit
}

const ProductInfo: React.FC<ProductInfoProps> = ({ kit }) => {
  const t = useTranslations('kits')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const [quantity, setQuantity] = useState(1)

  const user = useAppSelector((state) => state.auth?.user)

  const [updateCartItem] = useUpdateCartItemsMutation()

  const handleAddToCart = (productId: number, newQuantity: number) => {
    updateCartItem({ userId: user?.userId || '', productId, quantity: newQuantity }).unwrap()
    toast.success(tt('successMessage.addToCart'))
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className='space-y-6'
    >
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='mb-3 text-3xl leading-tight font-semibold text-gray-900 lg:text-4xl'
        >
          {kit.name}
        </motion.h1>
      </div>

      {/* Product Features */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <span className='mb-2'>{kit.description}</span>

        <p>
          <span className='font-medium'>{t('detail.weight')}:</span> {kit.weight} grams
        </p>
        <p>
          <span className='font-medium'>{t('detail.dimensions')}:</span> {kit.dimensions}
        </p>
      </motion.div>

      {/* Select Product */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <h3 className='mb-3 text-lg font-bold text-gray-900'>{t('detail.selectYourProduct')}</h3>
        <div className='space-y-3'>
          <motion.button
            key={kit.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={'w-full rounded-xl border-1 border-blue-500 bg-white p-4 text-left transition-all'}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Image
                  src={kit.images[0]?.imageUrl ?? ''}
                  alt='pro-img'
                  width={60}
                  height={60}
                  className='rounded-lg'
                />
                <div>
                  <div className='font-bold text-gray-900'>{kit.name}</div>
                </div>
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProductInfo
