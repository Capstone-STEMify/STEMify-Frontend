import { Badge } from '@/components/shadcn/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { cn } from '@/shadcn/utils'
import { ExternalLink, GraduationCap, Info, ArrowUp, ArrowDown } from 'lucide-react'
import { DashboardData } from '../../types/dashboard.type'
import { useTranslations } from 'next-intl'

// Helper component to show change
function ChangeBadge({ change }: { change: number }) {
  const isPositive = change >= 0
  return (
    <Badge className={cn('mt-1 self-start', isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
      {isPositive ? '+' : ''}
      {change}
    </Badge>
  )
}

// Define props interface
interface TotalStudentsCardProps {
  data: DashboardData
}

const TOTAL_CAPSULES = 30

export function TotalStudentsCard({ data }: TotalStudentsCardProps) {
  const { currentPeriod, change } = data
  const { totalUsers, totalTeachers, totalStudents } = currentPeriod

  const teacherPercent = totalUsers > 0 ? (totalTeachers / totalUsers) * 100 : 0
  const studentPercent = totalUsers > 0 ? (totalStudents / totalUsers) * 100 : 0

  const t = useTranslations('dashboard.organization')
  const tc = useTranslations('common')

  const rates = [
    {
      title: t('teacher'),
      count: teacherPercent,
      people: totalTeachers,
      change: change.totalTeachers,
      color: 'bg-yellow-400'
    },
    {
      title: t('student'),
      count: studentPercent,
      people: totalStudents,
      change: change.totalStudents,
      color: 'bg-blue-500'
    }
  ]

  // Recalculate capsules
  const capsules: string[] = []
  let currentCount = 0

  const rate1Count = Math.round((rates[0].count * TOTAL_CAPSULES) / 100)
  const rate2Count = Math.round((rates[1].count * TOTAL_CAPSULES) / 100)
  currentCount = rate1Count + rate2Count

  const remainingCount = TOTAL_CAPSULES - currentCount

  for (let i = 0; i < rate1Count; i++) capsules.push(rates[0].color)
  for (let i = 0; i < rate2Count; i++) capsules.push(rates[1].color)
  for (let i = 0; i < remainingCount; i++) capsules.push('bg-gray-200')

  // Calculate percentage labels for the capsule bar
  const rate1Label = teacherPercent > 0 ? `${Math.round(teacherPercent)}%` : ''
  const rate2Label = studentPercent > 0 ? `${Math.round(studentPercent)}%` : ''

  return (
    <Card className='h-full rounded-xl border-none bg-white shadow-sm'>
      <CardHeader className='flex flex-row items-center justify-between pt-6 pb-2'>
        <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
          {t('user')}
          <Info className='h-4 w-4 text-gray-400' />
        </CardTitle>
        <span className='cursor-pointer text-sm text-indigo-600'>{tc('button.view')}</span>
      </CardHeader>
      <CardContent>
        <div className='mt-4 flex items-center gap-2 md:pb-8'>
          <div className='rounded-lg bg-indigo-100 p-2'>
            <GraduationCap className='h-6 w-6 text-indigo-600' />
          </div>
          <p className='text-4xl font-semibold'>{totalUsers}</p>
          <Badge
            className={cn(
              'mt-1 self-start',
              change.totalUsers >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            )}
          >
            {change.totalUsers >= 0 ? '+' : ''}
            {change.totalUsers}%
          </Badge>
        </div>

        <div className='relative mt-8 mb-6 w-full md:mt-6 md:mb-2'>
          <span className='absolute -top-5 left-0 text-sm font-semibold text-gray-700'>{rate1Label}</span>
          <span
            className='absolute -top-5 text-sm font-semibold text-gray-700'
            style={{ left: `${Math.round(teacherPercent)}%` }}
          >
            {rate2Label}
          </span>

          <div className='flex w-full justify-between'>
            {capsules.map((color, i) => (
              <div key={i} className={cn('h-8 w-1.5 rounded-full', color)} />
            ))}
          </div>
        </div>

        <div className='mt-6 space-y-4 md:pt-10'>
          {rates.map((rate) => (
            <div key={rate.title} className='flex items-center justify-between text-sm'>
              <div className='flex items-center'>
                <span className={cn('mr-2 h-2.5 w-2.5 rounded-full', rate.color)}></span>
                <span className='text-gray-600'>{rate.title}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-gray-500'>{rate.people} People</span>
                <span className={cn('flex items-center text-xs', rate.change >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {rate.change >= 0 ? <ArrowUp className='h-3 w-3' /> : <ArrowDown className='h-3 w-3' />}
                  {rate.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
