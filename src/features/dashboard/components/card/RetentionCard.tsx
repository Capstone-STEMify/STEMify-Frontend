'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { GraduationCap, Info, ArrowUp, ArrowDown } from 'lucide-react'
import { Badge } from '@/components/shadcn/badge'
import { cn } from '@/shadcn/utils'
import { DashboardData } from '../../types/dashboard.type'
import { useTranslations } from 'next-intl'

// Define props interface
interface StudentRetentionCardProps {
  data: DashboardData
}

export function StudentRetentionCard({ data }: StudentRetentionCardProps) {
  const t = useTranslations('dashboard.organization')
  const tc = useTranslations('common')
  const { currentPeriod, previousPeriod, change } = data

  const percentage = change.totalCurriculumEnrollments
  const absoluteChange = currentPeriod.totalCurriculumEnrollments - previousPeriod.totalCurriculumEnrollments

  const pieData = [
    { name: 'Change', value: Math.abs(percentage), color: percentage >= 0 ? '#4F46E5' : '#EF4444' },
    { name: 'Remaining', value: 100 - Math.abs(percentage), color: '#E0E7FF' }
  ]

  return (
    <Card className='h-full rounded-xl border-none bg-white shadow-md'>
      <CardHeader className='flex flex-row items-center justify-between pt-6'>
        <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
          {t('enrollment')}
          <Info className='h-4 w-4 text-gray-400' />
        </CardTitle>
        <span className='cursor-pointer text-sm text-indigo-600'>{tc('button.view')}</span>
      </CardHeader>
      <CardContent>
        <div className='mt-4 flex items-center gap-2'>
          <div className='rounded-lg bg-indigo-100 p-2'>
            <GraduationCap className='h-6 w-6 text-indigo-600' />
          </div>
          <p className='text-3xl font-semibold'>
            {percentage >= 0 ? '+' : ''}
            {percentage}%
          </p>
          <Badge
            className={cn(
              'mt-1 self-start',
              absoluteChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            )}
          >
            {absoluteChange >= 0 ? '+' : ''}
            {absoluteChange}
          </Badge>
        </div>

        <div className='relative mt-4 h-44 w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={pieData}
                cx='50%'
                cy='100%'
                innerRadius={65}
                outerRadius={120}
                startAngle={180}
                endAngle={0}
                dataKey='value'
                paddingAngle={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-30'>
            <span className='text-xl font-semibold text-gray-800'>
              {percentage >= 0 ? '+' : ''}
              {percentage}%
            </span>
            <span className='text-sm text-gray-500'>{t('change')}</span>
          </div>
        </div>

        <div className='mt-4 mb-4 flex items-start gap-3 rounded-lg bg-gray-50 p-3'>
          <Info className='mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500' />
          <p className='text-xs text-gray-600'>
            {/* Static feedback text as per original component */}
            <span className='font-semibold'>{t('feedback')} -</span> {t('feedbackDetail')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
