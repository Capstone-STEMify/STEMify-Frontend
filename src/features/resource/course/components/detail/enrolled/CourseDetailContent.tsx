'use client'

import { Badge } from '@/components/shadcn/badge'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import CardLayout from '@/components/shared/card/CardLayout'
import SEmpty from '@/components/shared/empty/SEmpty'
import { SDropDown } from '@/components/shared/SDropDown'
import { SkeletonCard } from '@/components/shared/skeleton/SkeletonCard'
import { SPagination } from '@/components/shared/SPagination'
import { useSearchLessonQuery } from '@/features/resource/lesson/api/lessonApi'
import { setPageIndex, setPageSize } from '@/features/resource/lesson/slice/lessonSlice'
import {
  useGetStudentProgressByIdQuery,
  useSearchStudentProgressQuery
} from '@/features/student-progress/api/studentProgressApi'
import {
  setSelectedEnrollmentId,
  setSelectedLessonStatus
} from '@/features/student-progress/slice/studentProgressSlice'
import { ProgressStatus, StudentProgress } from '@/features/student-progress/types/studentProgress.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { formatDuration } from '@/utils/index'
import { skipToken } from '@reduxjs/toolkit/query'
import { EllipsisVertical } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

type CourseDetailContentProps = {
  courseId: number
  enrollmentId?: number // Optional if not always provided
}

export default function CourseDetailContent({ courseId, enrollmentId }: CourseDetailContentProps) {
  const dispatch = useAppDispatch()
  const lessonParams = useAppSelector((state) => state.lesson)

  useEffect(() => {
    dispatch(setPageSize(12))
  }, [dispatch])

  const { data: lessonData, isLoading, isFetching } = useSearchLessonQuery({ courseId, ...lessonParams })
  const { data: lessonProgressData } = useSearchStudentProgressQuery(enrollmentId ? { enrollmentId } : skipToken)
  const progressMap = lessonProgressData?.data?.items?.reduce(
    (acc, progress) => {
      if ('lessonId' in progress && progress.lessonId !== undefined) {
        acc[progress.lessonId] = progress.status
      }
      return acc
    },
    {} as Record<number, ProgressStatus>
  )

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }
  const handleSelectLesson = (lessonId: number) => {
    const status = progressMap?.[lessonId]
    if (status) {
      dispatch(setSelectedLessonStatus(status))
      dispatch(setSelectedEnrollmentId(enrollmentId))
    }
  }

  if (isLoading || isFetching) {
    return (
      <div className='grid h-fit grid-cols-1 justify-items-center gap-y-10 py-10 sm:grid-cols-2 md:grid-cols-3'>
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
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
    <ScrollArea className='h-[600px] px-5 select-none'>
      <div className='grid h-fit grid-cols-1 justify-items-center gap-y-10 py-10 sm:grid-cols-2 md:grid-cols-3'>
        {lessonData.data.items.map((lesson) => (
          <div key={lesson.id} className='relative flex gap-1'>
            <Link
              href={`/resource/lesson/${lesson.id}`}
              onClick={() => handleSelectLesson(lesson.id)}
              className='flex w-fit flex-col justify-between'
            >
              <CardLayout
                imageSrc={lesson.imageUrl}
                size='sm'
                badge={
                  progressMap?.[lesson.id] && (
                    <Badge className='bg-gray-50/80 text-gray-800 backdrop-blur-md'>{progressMap[lesson.id]}</Badge>
                  )
                }
              >
                <div>
                  <p className='text-muted-foreground text-xs font-medium'>Lesson</p>
                  <h3 className='text-sm font-semibold text-gray-900'>{lesson.title}</h3>
                  <p className='line-clamp-2 text-xs text-gray-600'>{lesson.description}</p>
                </div>

                <div className='mt-auto flex flex-wrap items-center gap-2'>
                  <Badge className='bg-sky-custom-300'>{lesson.ageRangeLabel}</Badge>
                  <Badge className='bg-red-300'>{formatDuration(lesson.duration)}</Badge>
                </div>
              </CardLayout>
            </Link>

            <div key={lesson.id} className='absolute top-2 right-2 flex flex-col items-center justify-center gap-1'>
              <SDropDown
                trigger={
                  <EllipsisVertical className='mt-2 h-5 w-5 text-white hover:scale-[1.1] hover:text-yellow-400' />
                }
                items={[
                  <p key='view' className='text-sm'>
                    View
                  </p>,
                  <p key='add-to-course' className='text-sm'>
                    Add to Course
                  </p>,
                  <p key='share' className='text-sm'>
                    Share
                  </p>
                ]}
              />
            </div>
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
    </ScrollArea>
  )
}
