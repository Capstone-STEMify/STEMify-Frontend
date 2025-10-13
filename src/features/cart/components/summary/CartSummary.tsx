import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useState } from 'react'

interface PaymentSummaryProps {
  productTotal: number
  onCheckout: () => void
  onRemoveAll: () => void
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({ productTotal, onCheckout, onRemoveAll }) => {
  const [discountCode, setDiscountCode] = useState('')
  const t = useTranslations('cart')

  const total = productTotal // + shipping - discount

  return (
    <div className='sticky top-6 rounded-xl bg-white p-6 shadow-lg'>
      {/* Total */}
      <div className='mb-6'>
        <h3 className='mb-2 text-lg text-gray-600'>{t('list.total')}:</h3>
        <div className='mb-4 flex items-baseline gap-2'>
          <span className='text-4xl font-bold text-gray-900 md:text-5xl'>{total.toLocaleString()}</span>
          <span className='text-2xl font-medium text-gray-600'>{'₫'}</span>
        </div>

        {/* Breakdown */}
        <div className='mb-4 space-y-2 border-t pt-4 text-sm'>
          <div className='flex items-center justify-between'>
            <span className='font-semibold text-gray-900'>{t('list.productTotal')}:</span>
            <span className='font-bold text-gray-900'>
              {productTotal.toLocaleString()} {'₫'}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            {/* <span className='text-gray-600'>- {t('summary.ofWhichTax')}:</span> */}
            {/* <span className='text-gray-900'>
              {productTax.toLocaleString()} {'₫'}
            </span> */}
          </div>
          <div className='flex items-center justify-between'>
            <span className='font-semibold text-gray-900'>{t('list.shipping')}:</span>
            <span className='font-bold text-gray-900'>{t('list.free')}</span>
          </div>
          {/* Discount Section */}
          <div>
            <p className='my-3 font-bold text-gray-900'>{t('list.discount')}</p>
            <div className='flex gap-2'>
              <Input
                type='text'
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder={t('list.enterCode')}
                className='flex-1 rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
              <Button className='bg-blue-custom-50 text-sky-custom-600 border-sky-custom-600 rounded-lg border-1 px-4 font-semibold transition-all hover:shadow-sm active:scale-98'>
                {t('list.apply')}
              </Button>
            </div>
          </div>
        </div>
        <div className='space-y-2 border-t pt-4 text-sm'>
          <p className='mb-8 text-sm'>
            {t('list.byClickingCheckout')}
            <br />
            <a href='#' className='hover:text-semibold underline transition-colors hover:text-blue-500'>
              {t('list.agreeTerms')}
            </a>{' '}
            &{' '}
            <a href='#' className='hover:text-semibold underline transition-colors hover:text-blue-500'>
              {t('list.privacyNotice')}
            </a>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='mb-6 space-y-3'>
        <Button
          onClick={onCheckout}
          className='w-full rounded-lg bg-sky-500 py-6 font-semibold text-white transition-all hover:shadow-lg'
        >
          {t('list.checkout')}
        </Button>
        <Button
          onClick={onRemoveAll}
          className='w-full rounded-lg bg-gray-100 py-6 font-semibold text-gray-800 transition-all hover:shadow-lg'
        >
          {t('list.removeAll')}
        </Button>
      </div>
    </div>
  )
}
