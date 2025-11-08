'use client'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'

interface SubscriptionPeriodProps {
  startDate: Date | null
  endDate: Date | null
  onStartDateChange: (date: Date | null) => void
}

export default function SubscriptionPeriod({ startDate, endDate, onStartDateChange }: SubscriptionPeriodProps) {
  return (
    <div className='space-y-4'>
      <Label className='text-base font-semibold text-slate-900'>Subscription Period</Label>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label className='text-sm font-medium text-slate-700'>Start Date</Label>
          <Input
            type='date'
            value={startDate ? startDate.toISOString().split('T')[0] : ''}
            onChange={(e) => onStartDateChange(e.target.value ? new Date(e.target.value) : null)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className='space-y-2'>
          <Label className='text-sm font-medium text-slate-700'>End Date</Label>
          <Input
            disabled
            value={
              endDate
                ? endDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                : ''
            }
            placeholder='Auto-calculated from start date'
            className='bg-slate-50 text-slate-600'
          />
          <p className='text-xs text-slate-500'>Automatically calculated based on start date and billing cycle</p>
        </div>
      </div>
    </div>
  )
}
