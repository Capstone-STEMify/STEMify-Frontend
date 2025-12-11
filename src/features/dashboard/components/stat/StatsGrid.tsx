'use client'

import { Card, CardContent } from '@/components/shadcn/card'
import { Briefcase, Award, ArrowUpRight, Users, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/shadcn/utils'
import { DashboardData } from '../../types/dashboard.type'
import { useTranslations } from 'next-intl'

// Helper component to show change
function ChangeBadge({ change }: { change: number }) {
  const isPositive = change >= 0
  return (
    <div
      className={cn('flex items-center gap-0.5 text-xs font-medium', isPositive ? 'text-green-600' : 'text-red-600')}
    >
      {isPositive ? <ArrowUp className='h-3 w-3' /> : <ArrowDown className='h-3 w-3' />}
      {Math.abs(change)}%
    </div>
  )
}

// Define props interface
interface QuickStatsGridProps {
  data: DashboardData
}

export function QuickStatsGrid({ data }: QuickStatsGridProps) {
  const { currentPeriod, change } = data

  const t = useTranslations('dashboard.organization')
  const tc = useTranslations('common')

  const stats = [
    {
      title: t('totalCurriculum'),
      value: currentPeriod.totalCurriculum,
      change: change.totalCurriculum,
      icon: Briefcase,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: t('cert'),
      value: currentPeriod.totalCurriculumCertificates,
      change: change.totalCurriculumCertificates,
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: t('totalClass'),
      value: currentPeriod.totalClassrooms,
      change: change.totalClassrooms,
      icon: ArrowUpRight,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ]

  return (
    <div className='grid grid-cols-2 gap-6'>
      {stats.map((stat) => (
        <Card key={stat.title} className='rounded-xl border-none bg-white shadow-md'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              {/* Replace chart with ChangeBadge */}
              {stat.change !== null ? <ChangeBadge change={stat.change} /> : <div className='h-5' />}
            </div>
            <h3 className='mt-4 text-2xl font-semibold'>{stat.value}</h3>
            <p className='text-sm text-gray-500'>{stat.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
