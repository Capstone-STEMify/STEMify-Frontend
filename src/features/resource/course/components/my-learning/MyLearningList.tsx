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

type MyLearningListProps = {
  studentId?: string
}

export function MyLearningList({ studentId }: MyLearningListProps) {
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
        title='No Courses Enrolled'
        description='You have not enrolled in any courses yet. Explore our catalog to find courses that interest you.'
        icon={<BookOpen className='h-12 w-12 text-gray-400' />}
      />
    )
  }

  return (
    <div className='space-y-6'>
      {/*  title='Your Courses'
        description='Continue your learning journey with these courses' */}
      <div className='mb-10 space-y-2 text-center'>
        <h1 className='text-4xl'>My Learning</h1>
        <p className='text-2xl text-gray-600'>Continue your learning journey with these courses</p>
      </div>
      <div className='space-y-6'>
        {/* Course Grid */}
        <div className='grid grid-cols-1 place-items-center sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'>
          {enroll.data.items.map((e) => (
            <Link
              href={`/resource/course/${e.courseId}`}
              key={e.id}
              onClick={() => dispatch(setSelectedEnrollmentId(e.id))}
            >
              <CardLayout
                size='lg'
                imageSrc={e.coverImageUrl}
                badge={<Badge className='bg-gray-50/80 text-gray-800 backdrop-blur-md'>{e.status}</Badge>}
              >
                <div className='flex min-h-0 flex-1 flex-col'>
                  <h3 className='text-lg font-semibold'>{e.courseTitle}</h3>
                  <p className='line-clamp-4 text-sm text-gray-600'>{e.description}</p>
                  {/* footer */}
                  <div className='mt-auto flex items-center gap-2'>
                    <Badge className='bg-green-100 text-green-800'>{formatDuration(e.duration)}</Badge>
                    <Badge className='bg-blue-100 text-blue-800'>{e.ageRangeLabel} ages</Badge>
                  </div>
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
