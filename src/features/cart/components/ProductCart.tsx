'use client'

import React, { useEffect, useState } from 'react'
import { PaymentSummary } from './summary/CartSummary'
import NewsletterBanner from './banner/NewLetterBanner'
import { useAppSelector } from '@/hooks/redux-hooks'
import SEmpty from '@/components/shared/empty/SEmpty'
import { useLocale, useTranslations } from 'next-intl'
import { RelatedProductsCarousel } from './related-product/RelatedProduct'
import { useRouter } from 'next/navigation'
import {
  useDeleteCartItemMutation,
  useGetCartByUserIdQuery,
  useUpdateCartItemsMutation
} from '@/features/cart/api/cartApi'
import { CartItem } from '@/features/cart/components/items/CartItems'
import { useSearchKitQuery } from '@/features/resource/kit/api/kitProductApi'
import { Button } from '@/components/shadcn/button'
import { CartItemData } from '@/features/cart/types/cart.type'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'

export default function ProductCart() {
  const t = useTranslations('cart')
  const tt = useTranslations('toast')
  const locale = useLocale()
  const router = useRouter()

  const user = useAppSelector((state) => state.auth?.user)
  const kitState = useAppSelector((state) => state.kit)
  const { openModal } = useModal()

  const { data: cartData, isLoading } = useGetCartByUserIdQuery(
    { userId: user?.userId || '' },
    { skip: !user?.userId, refetchOnMountOrArgChange: true }
  )
  const { data: kitData } = useSearchKitQuery(kitState)
  const [updateCartItem] = useUpdateCartItemsMutation()
  const [deleteCartItem] = useDeleteCartItemMutation()

  // Local state to manage cart items
  const [cartItems, setCartItems] = useState<CartItemData[]>([])
  useEffect(() => {
    if (cartData?.data?.items) {
      setCartItems(cartData.data.items)
    }
  }, [cartData])

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setCartItems((prev) => {
      return prev.map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item))
    })

    const oldItem = cartItems.find((item) => item.productId === productId)
    if (!oldItem) return

    const quantityChange = newQuantity - oldItem.quantity

    if (quantityChange !== 0) {
      updateCartItem({
        userId: user?.userId || '',
        productId,
        quantity: quantityChange
      }).unwrap()
    }
  }

  const handleRemoveItem = (id: number) => {
    openModal('confirm', {
      message: tt('confirmMessage.removeItemFromCart'),
      onConfirm: async () => {
        await deleteCartItem({ userId: user?.userId || '', productId: id }).unwrap()
        toast.success(tt('successMessage.removeItemFromCart'))
      }
    })
  }

  const handleRemoveAll = () => {
    if (confirm('Are you sure you want to remove all items from cart?')) {
      // setCartItems([])
    }
  }

  const handleCheckout = () => {
    alert('Proceeding to checkout...')
    router.push('/payment-status')
  }

  if (isLoading) {
    return <LoadingComponent />
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='py-8 md:py-12'>
        {/* Header */}
        <div className='mx-auto mb-20 max-w-7xl px-4'>
          <div className='mb-8'>
            <h1 className='mb-2 text-3xl font-bold text-gray-900 md:text-4xl'>{t('list.title')}</h1>
            <p className='text-gray-600'>
              {cartItems.length ?? 0} {t('list.itemsInCart')}
            </p>
          </div>

          {!cartData || cartData.data.items.length === 0 ? (
            <div className='py-16 text-center'>
              <div className='mb-4 text-6xl'>🛒</div>
              <h3 className='mb-2 text-xl font-semibold text-gray-700'>{t('list.noData')}</h3>
              <p className='text-gray-500'>{t('list.noDataDescription')}</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8'>
              {/* Left Column - Cart Items */}
              <div className='lg:col-span-2'>
                <div>
                  {cartItems.map((item) => (
                    <>
                      <CartItem
                        key={item.productId}
                        cartItem={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemoveItem}
                      />
                      <hr className='border-gray-200' />
                    </>
                  ))}
                </div>

                {/* Continue Shopping Button (Mobile) */}
                <Button className='border-sky-custom-600 text-sky-custom-600 bg-sky-custom-50 mt-6 w-full rounded-lg border-2 px-6 py-3 font-semibold transition-all hover:bg-gray-50 lg:hidden'>
                  {t('list.continueShopping')}
                </Button>
              </div>

              {/* Right Column - Payment Summary */}
              <div className='lg:col-span-1'>
                <PaymentSummary
                  productTotal={cartData.data.totalPrice}
                  onCheckout={handleCheckout}
                  onRemoveAll={handleRemoveAll}
                />
              </div>
            </div>
          )}

          {/* Continue Shopping Button (Desktop) */}
          {cartData && cartData.data.items.length > 0 && (
            <Button
              onClick={() => router.push(`/${locale}/shop`)}
              className='border-sky-custom-600 text-sky-custom-600 bg-sky-custom-50 rounded-lg border-2 font-semibold transition-all hover:bg-blue-50 lg:block'
            >
              {t('list.continueShopping')}
            </Button>
          )}
        </div>

        <NewsletterBanner />

        <RelatedProductsCarousel title={t('list.youMayAlsoLike')} products={kitData?.data.items ?? []} />
      </div>
    </div>
  )
}
