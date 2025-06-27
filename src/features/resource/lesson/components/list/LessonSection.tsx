'use client'
import { Badge } from '@/components/shadcn/badge'
import CardLayout from '@/components/shared/card/CardLayout'
import { useGetAllLessonQuery } from '@/features/resource/lesson/api/lessonApi'
import { formatDuration } from '@/utils/index'
import React from 'react'

export default function LessonSection() {
  const { data: lessonData } = useGetAllLessonQuery()

  return (
    <main className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {lessonData?.data.items.map((lesson, index) => {
        return (
          <CardLayout size='lg' key={index} imageSrc={lesson.imageUrl} infor={<Badge>{lesson.status}</Badge>}>
            <div className='flex min-h-0 flex-1 flex-col'>
              <h3 className='text-lg font-semibold'>{lesson.title}</h3>
              <p className='text-sm text-gray-600'>{lesson.description}</p>
              {/* footer */}
              <div className='mt-auto flex items-center gap-2'>
                {/* <Badge className='bg-blue-100 text-blue-800'>{lesson.}</Badge> */}
                <Badge className='bg-green-100 text-green-800'>{formatDuration(lesson.duration)}</Badge>
              </div>
            </div>
          </CardLayout>
        )
      })}
    </main>
  )
}
