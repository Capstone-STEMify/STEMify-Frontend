'use client'

import { Badge } from '@/components/shadcn/badge'
import CardLayout from '@/components/shared/card/CardLayout'
import SEmpty from '@/components/shared/empty/SEmpty'
import { SkeletonCard } from '@/components/shared/skeleton/SkeletonCard'
import { SPagination } from '@/components/shared/SPagination'
import { useSearchCourseQuery } from '@/features/resource/course/api/courseApi'
import { CourseQueryParams, CourseStatus } from '@/features/resource/course/types/course.type'
import { setPageIndex, setPageSize } from '@/features/resource/course/slice/courseSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import Link from 'next/link'
import { useEffect } from 'react'
import { LicenseType, UserRole } from '@/types/userRole'
import { useRouter } from 'next/navigation'
import { capitalizeFirst } from '@/utils/index'
import { useTranslations } from 'next-intl'
import { getLevelBadgeClass } from '@/utils/badgeColor'
import { useModal } from '@/providers/ModalProvider'

export default function CourseListContent() {
  const tc = useTranslations('common')
  const t = useTranslations('course')
  const tt = useTranslations('toast')
  const tm = useTranslations('message')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { openModal } = useModal()
  const courseParams = useAppSelector((state) => state.course)
  const userRole = useAppSelector((state) => state.selectedOrganization.currentRole)
  const PUBLIC_ROLES =
    userRole === LicenseType.STUDENT || userRole === UserRole.GUEST || userRole === LicenseType.TEACHER

  useEffect(() => {
    dispatch(setPageSize(12))
  }, [dispatch])

  const queryParams: CourseQueryParams = {
    courseId: courseParams.courseId,
    createdByUserId: courseParams.createdByUserId,
    ageRangeId: courseParams.ageRangeId,
    topicId: courseParams.topicId,
    skillId: courseParams.skillId,
    standardId: courseParams.standardId,
    pageNumber: courseParams.pageNumber,
    pageSize: courseParams.pageSize,
    search: courseParams.search,
    status: PUBLIC_ROLES ? CourseStatus.PUBLISHED : courseParams.status,
    orderBy: 'createdDate',
    sortDirection: 'Desc'
  }

  const { data: courseData, isLoading } = useSearchCourseQuery(queryParams)

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  if (isLoading) {
    return (
      <div className='my-5 grid h-fit grid-cols-1 justify-items-center gap-y-10 py-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'>
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

  const handleNavigate = (courseId?: number) => {
    if (courseId) {
      router.push(`/resource/course/update/${courseId}`)
    } else router.push('/resource/course/create')
  }

  if (!courseData || courseData.data.items.length === 0) {
    return <SEmpty title={t('list.noData')} description={t('list.noDataDetail')} />
  }

  return (
    <div className='px-5 select-none'>
      <div className='grid h-fit grid-cols-1 justify-items-center gap-10 py-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {courseData.data.items.map((course) => (
          <div key={course.id} className='relative flex min-w-0 gap-1'>
            <Link href={`/resource/course/${course.id}`} className='flex w-fit flex-col justify-between'>
              <CardLayout
                className='rounded-2xl border-none shadow-lg'
                imageSrc={course.imageUrl || '/images/fallback.png'}
                footer={
                  <div className='flex items-center gap-2'>
                    <Badge className='bg-sky-custom-300'>{course.ageRangeLabel}</Badge>
                    <Badge className={getLevelBadgeClass(course.level)}>{capitalizeFirst(course.level)}</Badge>
                  </div>
                }
              >
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>{course.code}</p>
                  <h3 className='text-md line-clamp-1 font-semibold text-gray-900'>{course.title}</h3>
                  <p className='line-clamp-2 text-sm text-gray-600'>{course.description}</p>
                </div>
              </CardLayout>
            </Link>
          </div>
        ))}
      </div>

      {courseData.data.totalPages > 1 && (
        <SPagination
          pageNumber={courseParams.pageNumber}
          totalPages={courseData.data.totalPages}
          onPageChanged={handlePageChange}
          className='pb-10'
        />
      )}
    </div>
  )
}
