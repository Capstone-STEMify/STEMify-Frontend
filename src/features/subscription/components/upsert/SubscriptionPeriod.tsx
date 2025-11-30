'use client'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { formatDate } from '@/utils/index'
import { useLocale, useTranslations } from 'next-intl'

interface SubscriptionPeriodProps {
  startDate: Date | null
  endDate: Date | null
  onStartDateChange: (date: Date | null) => void
}

export default function SubscriptionPeriod({ startDate, endDate, onStartDateChange }: SubscriptionPeriodProps) {
  const to = useTranslations('organization.subscription.create')
  const locale = useLocale()
  return (
    <div className='space-y-4'>
      <Label className='text-base font-semibold text-slate-900'>{to('period.header')}</Label>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label className='text-sm font-medium text-slate-700'>{to('period.startDate')}</Label>
          <Input
            type='date'
            value={startDate ? startDate.toISOString().split('T')[0] : ''}
            onChange={(e) => onStartDateChange(e.target.value ? new Date(e.target.value) : null)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className='space-y-2'>
          <Label className='text-sm font-medium text-slate-700'>{to('period.endDate')}</Label>
          <Input
            disabled
            value={endDate ? formatDate(endDate.toISOString(), { locale }) : ''}
            placeholder={to('period.endDateDescription')}
            className='bg-slate-50 text-slate-600'
          />
        </div>
      </div>
    </div>
  )
}
