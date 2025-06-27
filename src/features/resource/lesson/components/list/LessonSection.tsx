'use client'
import { Badge } from '@/components/shadcn/badge'
import CardLayout from '@/components/shared/card/CardLayout'
import { useSearchLessonQuery } from '@/features/resource/lesson/api/lessonApi'
import { LessonParams, LessonStatus } from '@/features/resource/lesson/types/lesson.type'
import { useQueryParamsHandler } from '@/hooks/useQueryParamsHandler'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { formatDuration } from '@/utils/index'
import { cn } from '@/utils/shadcn/utils'
import React from 'react'

export default function LessonSection() {
  const { params } = useQueryParamsHandler<LessonParams>({
    defaultParams: {
      pageNumber: 1,
      pageSize: 3,
      status: LessonStatus.PUBLISHED
    }
  })
  const { data: lessonData } = useSearchLessonQuery(params)

  return (
    <main className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {lessonData &&
        lessonData.data.items.map((lesson, index) => {
          return (
            <CardLayout
              size='lg'
              key={index}
              imageSrc={lesson.imageUrl}
              badge={
                <Badge className={cn('rounded-md px-2 py-0.5 text-xs font-medium', getStatusBadgeClass(lesson.status))}>
                  {lesson.status}
                </Badge>
              }
            >
              <div className='flex h-full flex-col space-y-3'>
                <div className='space-y-1'>
                  <h3 className='line-clamp-2 text-lg font-semibold text-gray-900'>{lesson.title}</h3>
                  <p className='text-muted-foreground line-clamp-3 text-sm'>{lesson.description}</p>
                </div>

                <div className='mt-auto flex items-center justify-start gap-2 border-t border-gray-200 pt-3'>
                  <Badge className='rounded-md bg-green-100 px-2 py-0.5 text-xs text-green-800'>
                    {formatDuration(lesson.duration)}
                  </Badge>
                </div>
              </div>
            </CardLayout>
          )
        })}
    </main>
  )
}
