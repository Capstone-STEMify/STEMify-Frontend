'use client'
import { Badge } from '@/components/shadcn/badge'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import CardLayout from '@/components/shared/card/CardLayout'
import { SDropDown } from '@/components/shared/SDropDown'
import { useSearchLessonQuery } from '@/features/resource/lesson/api/lessonApi'
import { LessonParams } from '@/features/resource/lesson/types/lesson.type'
import { useQueryParamsHandler } from '@/hooks/useQueryParamsHandler'
import { EllipsisVertical } from 'lucide-react'
import React from 'react'

export default function LessonListContent() {
  const { params } = useQueryParamsHandler<LessonParams>({
    defaultParams: {
      // status: LessonStatus.PUBLISHED
    }
  })
  const { data: lessonData } = useSearchLessonQuery(params)
  return (
    <ScrollArea className='h-screen pt-5'>
      <div className='grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {lessonData &&
          lessonData.data.items.map((lesson) => (
            <div className='flex gap-0.5' key={lesson.id}>
              <CardLayout imageSrc={lesson.imageUrl}>
                <div>
                  <p className='text-xs font-semibold text-gray-500'>Lesson</p>
                  <p className='font-semibold text-gray-900'>{lesson.title}</p>
                  <p className='line-clamp-2 text-sm leading-relaxed text-gray-600'>{lesson.description}</p>
                </div>

                <div className='mt-auto flex flex-wrap items-center gap-2 pt-1'>
                  <Badge variant='secondary' className='rounded-full px-3 py-1 text-xs font-medium text-gray-700'>
                    Age 10-12
                  </Badge>
                  <Badge variant='secondary' className='rounded-full px-3 py-1 text-xs font-medium text-gray-700'>
                    45:00
                  </Badge>
                </div>
              </CardLayout>
              <SDropDown
                trigger={<EllipsisVertical className='mt-2 h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700' />}
                items={[
                  <p className='text-sm'>View</p>,
                  <p className='text-sm'>Add to Course</p>,
                  <p className='text-sm'>Share</p>
                ]}
              />
            </div>
          ))}
      </div>
    </ScrollArea>
  )
}
