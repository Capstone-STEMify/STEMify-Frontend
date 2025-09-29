'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import CardLayout from '@/components/shared/card/CardLayout'
import { Badge } from '@/components/shadcn/badge'
import { BookOpen } from 'lucide-react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import { SPagination } from '@/components/shared/SPagination'
import { formatDuration } from '@/utils/index'
import { useSearchEnrollmentQuery } from '@/features/enrollment/api/enrollmentApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setPageIndex, setPageSize } from '@/features/enrollment/slice/enrollmentSlice'
import { setSelectedEnrollmentId } from '@/features/student-progress/slice/studentProgressSlice'
import { useTranslations } from 'next-intl'

type MyLearningListProps = {
  studentId?: string
}

export function MyLearningList({ studentId }: MyLearningListProps) {
  const t = useTranslations('MyLearning')

  const dispatch = useAppDispatch()
  const enrollParams = useAppSelector((state) => state.enrollment)
  const { data: enroll, isLoading } = useSearchEnrollmentQuery({ studentId, ...enrollParams }, { skip: !studentId })
  useEffect(() => {
    dispatch(setPageSize(6))
  }, [dispatch])

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  if (isLoading) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  if (!enroll) {
    return (
      <SEmpty
        title={t('noEnrollments')}
        description={t('noCourses')}
        icon={<BookOpen className='h-12 w-12 text-gray-400' />}
      />
    )
  }

  return (
    <div className='space-y-6'>
      {/*  title='Your Courses'
        description='Continue your learning journey with these courses' */}
      <div className='mb-10 space-y-2 text-center'>
        <h1 className='text-4xl'>{t('title')}</h1>
        <p className='text-2xl text-gray-600'>{t('subtitle')}</p>
      </div>
      <div className='space-y-6'>
        {/* Course Grid */}
        <div className='grid grid-cols-1 place-items-center gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3'>
          {enroll.data.items.map((e) => (
            <Link
              href={`/resource/course/${e.courseId}`}
              key={e.id}
              onClick={() => dispatch(setSelectedEnrollmentId(e.id))}
            >
              <CardLayout
                footer={
                  <div className='flex flex-wrap items-center gap-2'>
                    <Badge className='bg-green-100 text-green-800'>{formatDuration(e.duration)}</Badge>
                    <Badge className='bg-blue-100 text-blue-800'>{e.ageRangeLabel} ages</Badge>
                  </div>
                }
                imageRatio='aspect-3/2'
                imageSrc={e.coverImageUrl}
                badge={<Badge className='bg-gray-50/80 text-gray-800 backdrop-blur-md'>{e.status}</Badge>}
              >
                <div>
                  <h3 className='text-lg font-semibold'>{e.courseTitle}</h3>
                  <p className='line-clamp-4 text-sm text-gray-600'>{e.description}</p>
                  {/* footer */}
                </div>
              </CardLayout>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {enroll.data.totalPages > 1 && (
          <SPagination
            pageNumber={enroll.data.pageNumber}
            totalPages={enroll.data.totalPages}
            onPageChanged={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}
