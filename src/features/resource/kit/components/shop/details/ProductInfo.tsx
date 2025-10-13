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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='mb-4 flex items-center gap-3'
        >
          <div className='flex items-center gap-1'>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className='h-4 w-4 fill-yellow-400 text-yellow-400' />
            ))}
          </div>
          <span className='text-sm font-medium text-gray-600'>173 reviews</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='mb-4 flex items-center gap-3'
        >
          <span className='text-4xl font-semibold text-red-600'>
            {new Intl.NumberFormat('vi-VN').format(kit?.price ?? 0)} ₫
          </span>
          <span className='text-xl text-gray-400 line-through'>
            {new Intl.NumberFormat('vi-VN').format((kit?.price ?? 0) * 1.1)} ₫
          </span>
          <span className='flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white'>
            Best Seller
          </span>
        </motion.div>
      </div>

      {/* Buy More Save More */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className='rounded-2xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-5'
      >
        <h3 className='mb-3 text-lg font-bold text-gray-900'>Buy More, Save More</h3>
        <div className='mb-3 grid grid-cols-4 gap-2'>
          {[
            { amount: '$20', save: '$20' },
            { amount: '$40', save: '$100' },
            { amount: '$100', save: '$200' },
            { amount: '$300', save: '$500' }
          ].map((item, idx) => (
            <div key={idx} className='rounded-lg bg-white p-2 text-center shadow-sm'>
              <div className='text-xs font-bold text-gray-900'>
                {item.amount} <span className='text-[10px]'>OFF</span>
              </div>
              <div className='text-[10px] text-gray-600'>{item.save}</div>
            </div>
          ))}
        </div>
        <div className='flex items-center justify-center gap-2 rounded-lg bg-white/50 p-2 text-xs'>
          <div className='flex gap-1'>
            <div className='rounded bg-orange-500 px-2 py-1 font-bold text-white'>02</div>
            <span className='pt-1 text-[10px] text-gray-600'>DAYS</span>
          </div>
          <span className='text-gray-600'>:</span>
          <div className='flex gap-1'>
            <div className='rounded bg-orange-500 px-2 py-1 font-bold text-white'>04</div>
            <span className='pt-1 text-[10px] text-gray-600'>HRS</span>
          </div>
          <span className='text-gray-600'>:</span>
          <div className='flex gap-1'>
            <div className='rounded bg-orange-500 px-2 py-1 font-bold text-white'>10</div>
            <span className='pt-1 text-[10px] text-gray-600'>MIN</span>
          </div>
          <span className='text-gray-600'>:</span>
          <div className='flex gap-1'>
            <div className='rounded bg-orange-500 px-2 py-1 font-bold text-white'>18</div>
            <span className='pt-1 text-[10px] text-gray-600'>SEC</span>
          </div>
        </div>
        <p className='mt-3 text-center text-xs text-gray-600'>
          Get $10 off automatically—buy more to save even more for back-to-school essentials!
        </p>
      </motion.div> */}

      {/* Product Features */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <span className='mb-2'>{kit.description}</span>
        <p>
          <span className='font-medium'>{t('list.sku')}:</span> {kit.sku}
        </p>
        <p>
          <span className='font-medium'>{t('list.availability')}:</span>{' '}
          {kit.stockQuantity > 0 ? t('list.available') : t('list.outOfStock')}
          <span className='ml-2 text-gray-500'>
            ( {kit.stockQuantity} {t('list.items')})
          </span>
        </p>
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
              <div className='text-right'>
                <div className='text-lg font-bold text-gray-900'>
                  {new Intl.NumberFormat('vi-VN').format(kit?.price ?? 0)} ₫
                </div>
                <div className='text-sm text-gray-400 line-through'>
                  {new Intl.NumberFormat('vi-VN').format((kit?.price ?? 0) * 1.1)} ₫
                </div>
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Quantity & Add to Cart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className='space-y-4'
      >
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2 rounded-full border border-gray-400 bg-white px-6 py-2'>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className='h-10 w-10 cursor-pointer rounded-full bg-gray-100 text-xl font-bold shadow-sm transition-all hover:shadow-md'
            >
              -
            </button>
            <span className='w-12 text-center text-xl font-semibold'>{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className='h-10 w-10 cursor-pointer rounded-full bg-gray-100 text-xl font-bold shadow-sm transition-all hover:shadow-md'
            >
              +
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='flex-1 cursor-pointer rounded-full bg-gradient-to-r from-sky-300 to-sky-500 py-4 text-lg font-bold text-white shadow-xl shadow-blue-200 transition-all hover:shadow-2xl'
            onClick={() => handleAddToCart(kit.id, quantity)}
          >
            {tc('button.addToCart')}
          </motion.button>
        </div>
      </motion.div>

      {/* Delivery Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className='space-y-4 border-t border-gray-200 pt-6'
      >
        <div className='flex items-center gap-2 text-sm text-gray-700'>
          <Truck className='h-5 w-5 text-blue-600' />
          <span className='font-semibold'>{t('detail.primeDelivery')}</span>
        </div>

        <div className='rounded-xl bg-white p-4 shadow-sm'>
          <div className='mb-3 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Wallet className='h-5 w-5 text-green-600'></Wallet>
              <span className='font-semibold text-gray-900'>{t('detail.safeCheckout')}</span>
            </div>

            <div className='flex gap-2'>
              <img src='https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' alt='PayPal' className='h-5' />
              <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc_b7cYDTEaXxYsRDAdsVXYknigIr16CNbZQ&s'
                alt='Visa'
                className='h-5'
              />
              <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSutP9weqAPNNrV0V616bloZn2fwAdAOHqnFQ&s'
                alt='Mastercard'
                className='h-5'
              />
            </div>
          </div>
        </div>

        <div className='flex justify-between rounded-xl border border-yellow-200 bg-yellow-50 p-4 shadow-sm'>
          <div className='mb-2 flex items-center gap-2'>
            <Truck className='h-5 w-5 text-yellow-600' />
            <span className='font-semibold text-gray-900'>{t('detail.shipTime')}</span>
          </div>
          <div className='flex gap-2'>
            <img
              src='https://product.hstatic.net/1000405368/product/giao_hang_nhanh_toan_quoc_color.b7d18fe5_39425b03ee544ab2966d465756a00f89.png'
              alt='Amazon'
              className='h-10'
            />
            <img src='https://cdn.tgdd.vn/2020/03/GameApp/image-200x200-1.png' alt='FedEx' className='h-10' />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProductInfo
