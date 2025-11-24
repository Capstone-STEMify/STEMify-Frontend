'use client'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { useTranslations } from 'next-intl'

interface PricingSummaryProps {
  basePrice: number
  discountPercent: number
  onDiscountChange: (discount: number) => void
}

export default function PricingSummary({ basePrice, discountPercent, onDiscountChange }: PricingSummaryProps) {
  const to = useTranslations('organization.subscription.create')
  const finalPrice = basePrice * (1 - discountPercent / 100)

  return (
    <div className='space-y-4'>
      <Label className='text-base font-semibold text-slate-900'>{to('planOverview.pricing.header')}</Label>

      <div className='space-y-2'>
        <Label className='text-sm font-medium text-slate-700'>{to('planOverview.pricing.discount')}</Label>
        <Input
          type='number'
          min={0}
          max={100}
          value={discountPercent}
          onChange={(e) => onDiscountChange(Number(e.target.value))}
        />
      </div>

      <div className='mt-4 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4'>
        <div className='flex justify-between text-sm'>
          <span className='font-medium text-slate-700'>{to('planOverview.pricing.totalAmount')}</span>
          <span className='font-semibold text-slate-900'>{basePrice.toLocaleString()} VND</span>
        </div>

        <div className='flex justify-between text-sm'>
          <span className='font-medium text-slate-700'>{to('planOverview.pricing.discount')}</span>
          <span className='font-semibold text-green-600'>{discountPercent > 0 ? `-${discountPercent}%` : '—'}</span>
        </div>

        <div className='flex justify-between border-t border-slate-200 pt-2 text-base'>
          <span className='font-semibold text-slate-900'>{to('planOverview.pricing.finalAmount')}</span>
          <span className='font-bold text-blue-600'>{finalPrice.toLocaleString()} VND</span>
        </div>
      </div>
    </div>
  )
}
