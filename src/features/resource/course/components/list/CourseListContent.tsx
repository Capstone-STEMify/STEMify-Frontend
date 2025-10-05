'use client'

import { Badge } from '@/components/shadcn/badge'
import CardLayout from '@/components/shared/card/CardLayout'
import SEmpty from '@/components/shared/empty/SEmpty'
import { SDropDown } from '@/components/shared/SDropDown'
import { SkeletonCard } from '@/components/shared/skeleton/SkeletonCard'
import { SPagination } from '@/components/shared/SPagination'
import { useDeleteCourseMutation, useSearchCourseQuery } from '@/features/resource/course/api/courseApi'
import { CourseQueryParams, CourseStatus } from '@/features/resource/course/types/course.type'
import { setPageIndex, setPageSize } from '@/features/resource/course/slice/courseSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { EllipsisVertical, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { UserRole } from '@/types/userRole'
import { useRouter } from 'next/navigation'
import { capitalizeFirst } from '@/utils/index'
import { useTranslations } from 'next-intl'
import { getLevelBadgeClass } from '@/utils/badgeColor'
import { toast } from 'sonner'
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
  const auth = useAppSelector((state) => state.auth)
  const userRole = auth.user?.role || UserRole.GUEST
  const PUBLIC_ROLES = userRole === UserRole.STUDENT || userRole === UserRole.GUEST || userRole === UserRole.TEACHER

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
    return <SEmpty title={t('list.noData')} description={t('list.noDataDescription')} />
  }

  return (
    <div className='px-5 select-none'>
      <div className='grid h-fit grid-cols-1 justify-items-center gap-10 py-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {courseData.data.items.map((course) => (
          <div key={course.id} className='relative flex min-w-0 gap-1'>
            <Link href={`/resource/course/${course.id}`} className='flex w-fit flex-col justify-between'>
              <CardLayout
                imageSrc={course.imageUrl || '/images/fallback.png'}
                footer={
                  <div className='flex items-center gap-2'>
                    <Badge className='bg-sky-custom-300'>{course.ageRangeLabel}</Badge>
                    <Badge className={getLevelBadgeClass(course.level)}>{capitalizeFirst(course.level)}</Badge>
                  </div>
                }
              >
                <div>
                  <p className='text-muted-foreground text-xs font-medium'>{course.code}</p>
                  <h3 className='line-clamp-1 text-sm font-semibold text-gray-900'>{course.title}</h3>
                  <p className='line-clamp-2 text-xs text-gray-600'>{course.description}</p>
                  <p className='text-md mt-1 font-semibold text-sky-500'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                  </p>
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
