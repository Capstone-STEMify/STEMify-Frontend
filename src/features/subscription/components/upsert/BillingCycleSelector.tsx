'use client'
import { Calendar } from 'lucide-react'
import { Label } from '@/components/shadcn/label'
import { BillingCycle } from '@/features/plan/types/plan.type'
import { cn } from '@/utils/shadcn/utils'

interface BillingCycleSelectorProps {
  selectedBillingCycle: BillingCycle
  onBillingCycleChange: (cycle: BillingCycle) => void
}

export default function BillingCycleSelector({
  selectedBillingCycle,
  onBillingCycleChange
}: BillingCycleSelectorProps) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Calendar className='h-5 w-5 text-slate-600' />
        <Label className='text-base font-semibold text-slate-900'>Billing Cycle</Label>
      </div>

      <div className='flex items-center gap-4'>
        <div className='inline-flex rounded-lg bg-slate-100 p-1'>
          <button
            type='button'
            onClick={() => onBillingCycleChange(BillingCycle.SEMIANNUAL)}
            className={cn(
              'rounded-md px-6 py-2.5 text-sm font-medium transition-all duration-200',
              selectedBillingCycle === BillingCycle.SEMIANNUAL
                ? 'bg-white text-cyan-600 shadow-sm ring-1 ring-cyan-200'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Semiannual
          </button>
          <button
            type='button'
            onClick={() => onBillingCycleChange(BillingCycle.ANNUAL)}
            className={cn(
              'rounded-md px-6 py-2.5 text-sm font-medium transition-all duration-200',
              selectedBillingCycle === BillingCycle.ANNUAL
                ? 'bg-white text-cyan-600 shadow-sm ring-1 ring-cyan-200'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Annual
          </button>
        </div>
        <div className='flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1.5'>
          <div className='h-2 w-2 rounded-full bg-blue-500'></div>
          <span className='text-xs font-medium text-blue-700'>
            {selectedBillingCycle === BillingCycle.ANNUAL ? '12 months' : '6 months'} billing period
          </span>
        </div>
      </div>
    </div>
  )
}
