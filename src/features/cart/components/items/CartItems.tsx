// components/CartItem.tsx
import React from 'react'
import Image from 'next/image'
import { CartItemData } from '@/features/cart/types/cart.type'
import { Input } from '@/components/shadcn/input'
import { useTranslations } from 'next-intl'

interface CartItemProps {
  cartItem: CartItemData
  onQuantityChange: (productId: number, quantity: number) => void
  onRemove: (id: number) => void
}

export const CartItem: React.FC<CartItemProps> = ({ cartItem, onQuantityChange, onRemove }) => {
  const t = useTranslations('cart')

  return (
    <div className='bg-white p-5 transition-all hover:bg-white hover:shadow-md md:p-7'>
      <div className='flex gap-4 md:gap-6'>
        {/* Product Image */}
        <div className='h-24 w-24 flex-shrink-0 rounded-lg bg-white p-2 shadow-sm md:h-32 md:w-32'>
          <img src={cartItem.imageUrl} alt={cartItem.name} className='h-full w-full object-contain' />
        </div>

        {/* Product Details */}
        <div className='min-w-0 flex-1'>
          <div className='mb-2 flex items-start justify-between'>
            <div className='flex-1 pr-4'>
              <h3 className='mb-1 text-sm font-bold text-gray-900 md:text-base'>{cartItem.name}</h3>
              <p className='text-lg font-bold text-gray-900 md:text-xl'>
                {new Intl.NumberFormat('vi-VN').format(cartItem.unitPrice ?? 0)} ₫
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(cartItem.productId)}
              className='cursor-pointer text-xl font-bold text-gray-500 transition-colors hover:text-red-600'
              aria-label='Remove item'
            >
              ✕
            </button>
          </div>

          {/* Quantity and Price */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <label className='text-sm font-medium text-gray-700 md:text-base'>{t('list.quantity')}</label>
              <div className='relative inline-flex'>
                <Input
                  type='number'
                  min='1'
                  max='99'
                  value={cartItem.quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1
                    onQuantityChange(cartItem.productId, Math.max(1, Math.min(99, val)))
                  }}
                />
              </div>
            </div>

            <div className='text-right'>
              <p className='text-lg font-bold text-gray-900 md:text-xl'>
                {new Intl.NumberFormat('vi-VN').format(cartItem.subtotal ?? 0)} ₫
              </p>
              <button className='mt-1 text-sm text-blue-600 underline transition-colors hover:text-blue-800'>
                {t('list.moveToWishlist')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
