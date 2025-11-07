'use client'

import { Card, CardContent } from '@/components/shadcn/card'
import { Briefcase, Award, ArrowUpRight, Users, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/shadcn/utils'
import { DashboardData } from '../../types/dashboard.type'

// Helper component to show change
function ChangeBadge({ change }: { change: number }) {
  const isPositive = change >= 0
  return (
    <div
      className={cn(
        'flex items-center gap-0.5 text-xs font-medium',
        isPositive ? 'text-green-600' : 'text-red-600'
      )}
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

  const stats = [
    {
      title: 'Total Curriculums', // Changed from 'Completed Courses'
      value: currentPeriod.totalCurriculum,
      change: change.totalCurriculum,
      icon: Briefcase,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Earned Certificate',
      value: currentPeriod.totalCurriculumCertificates,
      change: change.totalCurriculumCertificates,
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Classrooms', // Changed from 'Course in Progress'
      value: currentPeriod.totalClassrooms,
      change: change.totalClassrooms,
      icon: ArrowUpRight, // Re-using icon, you can change it
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Community Support',
      value: '19k+', // Static as requested
      change: null, // No change for static value
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
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