// app/my-learning/components/RecentActivityList.tsx
'use client'

import React from 'react'
import { Clock, CheckCircle2, TrendingUp, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Separator } from '@/components/shadcn/separator'
import Link from 'next/link'

type Activity = {
  id: number
  type: 'completed' | 'progress' | 'certificate'
  title: string
  course: string
  time: string
  icon: any
  color: string
}

type RecentActivityListProps = {
  studentId?: string
}

export function RecentActivityList({ studentId }: RecentActivityListProps) {
  // TODO: Replace with actual API call
  const recentActivities: Activity[] = [
    {
      id: 1,
      type: 'completed',
      title: 'Completed Module 3',
      course: 'Introduction to Algorithms',
      time: '2 hours ago',
      icon: CheckCircle2,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'progress',
      title: 'Started new lesson',
      course: 'React Hooks Deep Dive',
      time: '5 hours ago',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'certificate',
      title: 'Earned Certificate',
      course: 'JavaScript ES6+',
      time: '1 day ago',
      icon: Award,
      color: 'text-purple-600'
    }
  ]

  return (
    <Card className='p-4'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-lg font-bold'>
          <Clock className='h-5 w-5 text-blue-600' />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivities.length > 0 ? (
          <div className='space-y-4'>
            {recentActivities.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className='flex gap-3'>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 ${activity.color}`}
                  >
                    <Icon className='h-4 w-4' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-medium text-gray-900'>{activity.title}</p>
                    <p className='line-clamp-1 text-xs text-gray-600'>{activity.course}</p>
                    <p className='mt-1 text-xs text-gray-400'>{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className='py-8 text-center'>
            <Clock className='mx-auto h-10 w-10 text-gray-300' />
            <p className='mt-2 text-sm text-gray-500'>No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
