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
import { useGetLessonStudentProgressQuery } from '@/features/student-progress/api/studentProgressApi'
import {
  setSelectedEnrollmentId,
  setSelectedLessonStatus
} from '@/features/student-progress/slice/studentProgressSlice'
import { ProgressStatus, StudentProgress } from '@/features/student-progress/types/studentProgress.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { formatDuration, useStatusTranslation } from '@/utils/index'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { cn } from '@/utils/shadcn/utils'
import { skipToken } from '@reduxjs/toolkit/query'
import { Lock, CheckCircle2, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect } from 'react'
import { toast } from 'sonner'

type CourseDetailContentProps = {
  courseId: number
  enrollmentId?: number
}

export default function CourseDetailContent({ courseId, enrollmentId }: CourseDetailContentProps) {
  const t = useTranslations('course')
  const tc = useTranslations('common')
  const dispatch = useAppDispatch()
  const lessonParams = useAppSelector((state) => state.lesson)

  const translateStatus = useStatusTranslation()

  useEffect(() => {
    dispatch(setPageSize(12))
  }, [dispatch])

  const {
    data: lessonData,
    isLoading,
    isFetching
  } = useSearchLessonQuery({ ...lessonParams, courseId, orderBy: 'orderindex', sortDirection: 'Asc' })
  const { data: lessonProgressData } = useGetLessonStudentProgressQuery(enrollmentId ? { enrollmentId } : skipToken)

  const progressMap = lessonProgressData?.data?.items?.reduce(
    (acc, progress) => {
      if ('lessonId' in progress && progress.lessonId !== undefined) {
        if (typeof progress.lessonId === 'number') {
          acc[progress.lessonId] = progress.status
        }
      }
      return acc
    },
    {} as Record<number, ProgressStatus>
  )

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  const handleSelectLesson = (lessonId: number, status?: ProgressStatus) => {
    if (status === ProgressStatus.LOCKED) {
      toast.error('This lesson is locked. Complete previous lessons to unlock it.')
      return
    }

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
    return <SEmpty title={t('details.notFound')} description={t('details.notFoundDescription')} />
  }

  return (
    <ScrollArea className='h-[600px] px-5 select-none'>
      <div className='mt-5 grid h-fit grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 md:grid-cols-3'>
        {lessonData.data.items.map((lesson) => {
          const status = progressMap?.[lesson.id]
          const isLocked = status === ProgressStatus.LOCKED

          if (isLocked) {
            return (
              <div
                key={lesson.id}
                className={cn(
                  'relative flex w-fit flex-col justify-between',
                  'cursor-not-allowed opacity-40 transition-all duration-200'
                )}
                onClick={() => handleSelectLesson(lesson.id, status)}
              >
                <div className='absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-blue-400/10 backdrop-blur-[2px]'>
                  <div className='flex flex-col items-center text-blue-900'>
                    <div className='mb-2 rounded-full bg-blue-900 p-3'>
                      <Lock className='h-6 w-6 text-white' />
                    </div>
                    <span className='text-sm font-medium'>{translateStatus(ProgressStatus.LOCKED)}</span>
                  </div>
                </div>

                <CardLayout
                  imageSrc={lesson.imageUrl || '/images/fallback.png'}
                  footer={
                    <div className='flex items-center justify-between gap-2'>
                      <Badge className='bg-sky-custom-300'>{lesson.ageRangeLabel}</Badge>
                      <Badge className='bg-red-300'>{formatDuration(lesson.duration)}</Badge>
                    </div>
                  }
                >
                  <div>
                    <p className='text-muted-foreground text-xs font-medium'>{t('details.lesson.cardTitle')}</p>
                    <h3 className='line-clamp-1 text-sm font-semibold text-gray-900'>{lesson.title}</h3>
                    <p className='line-clamp-2 text-xs text-gray-600'>{lesson.description}</p>
                  </div>
                </CardLayout>
              </div>
            )
          }

          // ✅ Normal lesson card
          return (
            <Link
              key={lesson.id}
              href={`/resource/lesson/${lesson.id}`}
              onClick={() => handleSelectLesson(lesson.id, status)}
            >
              <CardLayout
                imageSrc={lesson.imageUrl || '/images/fallback.png'}
                badge={
                  status && (
                    <Badge className={cn(getStatusBadgeClass(status), 'gap-1 backdrop-blur-md')}>
                      {translateStatus(status)}
                    </Badge>
                  )
                }
                footer={
                  <div className='flex items-center justify-between gap-2'>
                    <Badge className='bg-sky-custom-300'>{lesson.ageRangeLabel}</Badge>
                    <Badge className='bg-red-300'>{formatDuration(lesson.duration)}</Badge>
                  </div>
                }
              >
                <div>
                  <p className='text-muted-foreground text-xs font-medium'>{t('details.lesson.cardTitle')}</p>
                  <h3 className='line-clamp-1 text-sm font-semibold text-gray-900'>{lesson.title}</h3>
                  <p className='line-clamp-2 text-xs text-gray-600'>{lesson.description}</p>
                </div>
              </CardLayout>
            </Link>
          )
        })}
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
