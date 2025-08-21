'use client'

import { Badge } from '@/components/shadcn/badge'
import CardLayout from '@/components/shared/card/CardLayout'
import SEmpty from '@/components/shared/empty/SEmpty'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SDropDown } from '@/components/shared/SDropDown'
import { SkeletonCard } from '@/components/shared/skeleton/SkeletonCard'
import { SPagination } from '@/components/shared/SPagination'
import { useSearchLessonQuery } from '@/features/resource/lesson/api/lessonApi'
import { setPageIndex, setPageSize } from '@/features/resource/lesson/slice/lessonSlice'
import { LessonQueryParams } from '@/features/resource/lesson/types/lesson.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { UserRole } from '@/types/userRole'
import { EllipsisVertical } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function LessonListContent() {
  const t = useTranslations('LessonList')

  const [updateActive, setUpdateActive] = useState(false)

  const { status } = useSession()
  const role = useAppSelector((state) => state.auth.user?.role) || UserRole.GUEST
  const PUBLIC_ROLES = UserRole.STUDENT || UserRole.GUEST || UserRole.TEACHER

  useEffect(() => {
    if (status === 'authenticated' && role === UserRole.STAFF) {
      setUpdateActive(true)
    } else {
      setUpdateActive(false)
    }
  }, [status, role])

  const dispatch = useAppDispatch()
  const lessonParams = useAppSelector((state) => state.lesson)

  useEffect(() => {
    dispatch(setPageSize(12))
  }, [dispatch])

  const queryParams: LessonQueryParams = {
    courseId: lessonParams.courseId,
    createdByUserId: lessonParams.createdByUserId,
    ageRangeId: lessonParams.ageRangeId,
    topicId: lessonParams.topicId,
    skillId: lessonParams.skillId,
    standardId: lessonParams.standardId,
    pageNumber: lessonParams.pageNumber,
    pageSize: lessonParams.pageSize,
    search: lessonParams.search,
    status: PUBLIC_ROLES.includes(role) ? 'PUBLISHED' : ''
  }

  const { data: lessonData, isLoading } = useSearchLessonQuery(queryParams)

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  if (isLoading) {
    return (
      <div className='my-5 grid h-screen grid-cols-1 justify-items-center gap-y-10 py-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'>
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100'>
        <LoadingComponent size={18} textShow={false} />
      </div>
    )
  }

  if (!lessonData || lessonData.data.items.length === 0) {
    return <SEmpty title={t('noLesson')} description={t('noLessonFound')} />
  }

  return (
    <div className='px-5 select-none'>
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
                  <Badge className='bg-sky-custom-300'>Age 10–12</Badge>
                  <Badge className='bg-red-300'>45:00</Badge>
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
                  updateActive ? (
                    <Link href={`/resource/lesson/update/${lesson.id}`} key='update' className='text-sm'>
                      <p>Update</p>
                    </Link>
                  ) : null,
                  <p key='add-to-course' className='text-sm'>
                    Add to Course
                  </p>,
                  <p key='share' className='text-sm'>
                    Share
                  </p>
                ].filter(Boolean)}
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
    </div>
  )
}
