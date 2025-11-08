'use client'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'

interface PricingSummaryProps {
  basePrice: number
  discountPercent: number
  onDiscountChange: (discount: number) => void
}

export default function PricingSummary({ basePrice, discountPercent, onDiscountChange }: PricingSummaryProps) {
  const finalPrice = basePrice * (1 - discountPercent / 100)

  return (
    <div className='space-y-4'>
      <Label className='text-base font-semibold text-slate-900'>Pricing</Label>

      <div className='space-y-2'>
        <Label className='text-sm font-medium text-slate-700'>Discount (%)</Label>
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
          <span className='font-medium text-slate-700'>Total Amount</span>
          <span className='font-semibold text-slate-900'>${basePrice.toLocaleString()}</span>
        </div>

        <div className='flex justify-between text-sm'>
          <span className='font-medium text-slate-700'>Discount</span>
          <span className='font-semibold text-green-600'>{discountPercent > 0 ? `-${discountPercent}%` : '—'}</span>
        </div>

        <div className='flex justify-between border-t border-slate-200 pt-2 text-base'>
          <span className='font-semibold text-slate-900'>Final Amount</span>
          <span className='font-bold text-blue-600'>${finalPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
