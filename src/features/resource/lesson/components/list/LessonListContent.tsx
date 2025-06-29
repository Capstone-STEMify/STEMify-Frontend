'use client'

import { Badge } from '@/components/shadcn/badge'
import CardLayout from '@/components/shared/card/CardLayout'
import SEmpty from '@/components/shared/empty/SEmpty'
import { SDropDown } from '@/components/shared/SDropDown'
import { SkeletonCard } from '@/components/shared/skeleton/SkeletonCard'
import { SPagination } from '@/components/shared/SPagination'
import { useSearchLessonQuery } from '@/features/resource/lesson/api/lessonApi'
import { setPageIndex, setPageSize } from '@/features/resource/lesson/slice/lessonSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { EllipsisVertical } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'

export default function LessonListContent() {
  const dispatch = useAppDispatch()
  const lessonParams = useAppSelector((state) => state.lesson)

  useEffect(() => {
    dispatch(setPageSize(12))
  }, [dispatch])

  const { data: lessonData, isLoading } = useSearchLessonQuery(lessonParams)

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  if (isLoading) {
    return (
      <div className='my-10 grid h-screen grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (!lessonData || lessonData.data.items.length === 0) {
    return (
      <SEmpty
        title='No Lessons Found'
        description='Try changing the search term or filters to find relevant lessons.'
      />
    )
  }

  return (
    <div className='px-5'>
      <div className='grid h-fit grid-cols-1 justify-items-center gap-y-10 py-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'>
        {lessonData.data.items.map((lesson) => (
          <div key={lesson.id} className='relative flex gap-1'>
            <Link href={`/resource/lesson/${lesson.id}`} className='flex w-fit flex-col justify-between'>
              <CardLayout imageSrc={lesson.imageUrl} size='sm'>
                <div>
                  <p className='text-muted-foreground text-xs font-medium'>Lesson</p>
                  <h3 className='text-sm font-semibold text-gray-900'>{lesson.title}</h3>
                  <p className='line-clamp-2 text-xs text-gray-600'>{lesson.description}</p>
                </div>

                <div className='mt-auto flex flex-wrap items-center gap-2'>
                  <Badge className='bg-skye-custom-300'>Age 10–12</Badge>
                  <Badge className='bg-red-300'>45:00</Badge>
                </div>
              </CardLayout>
            </Link>

            <SDropDown
              trigger={<EllipsisVertical className='mt-2 h-4 w-4 text-gray-500 hover:text-gray-700' />}
              items={[
                <p className='text-sm'>View</p>,
                <p className='text-sm'>Add to Course</p>,
                <p className='text-sm'>Share</p>
              ]}
            />
          </div>
        ))}
      </div>

      {lessonData.data.totalPages > 1 && (
        <SPagination
          pageNumber={lessonParams.pageNumber}
          totalPages={lessonData.data.totalPages}
          onPageChanged={handlePageChange}
          className='pb-10'
        />
      )}
    </div>
  )
}
