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
import { capitalizeFirst, formatDuration } from '@/utils/index'
import { useTranslations } from 'next-intl'
import { getCourseStatusBadgeClass, getLevelBadgeClass } from '@/utils/badgeColor'
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
    dispatch(setPageSize(9))
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
  const [deleteCourse] = useDeleteCourseMutation()

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

  const handleDelete = async (e: React.MouseEvent, courseId: number) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      openModal('confirm', {
        message: tm('confirmDelMessage', { title: '' }),
        onConfirm: async () => {
          await deleteCourse(courseId).unwrap()
          toast.success(tt('successMessage.delete'))
        }
      })
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  if (!courseData || courseData.data.items.length === 0) {
    return <SEmpty title={t('list.noData')} description={t('list.noDataDescription')} />
  }

  return (
    <div className='px-5 select-none'>
      <div className='grid h-fit grid-cols-1 justify-items-center gap-y-10 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {userRole === UserRole.STUDENT || userRole === UserRole.GUEST ? null : (
          <div
            className='shadow-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-9.5 transition hover:scale-102 hover:border-blue-400 hover:bg-blue-50'
            onClick={() => handleNavigate()}
          >
            <PlusCircle size={70} className='text-gray-500' />
            <p className='mt-4 text-sm font-medium text-gray-500'>{tc('button.createCourse')}</p>
          </div>
        )}
        {courseData.data.items.map((course) => (
          <div key={course.id} className='relative flex min-w-0 gap-1'>
            <Link href={`/resource/course/${course.id}`} className='flex w-fit flex-col justify-between'>
              <CardLayout
                imageSrc={course.imageUrl || '/images/fallback.png'}
                size='sm'
                badge={
                  <Badge className={getCourseStatusBadgeClass(course.status)}>{capitalizeFirst(course.status)}</Badge>
                }
              >
                <div>
                  <p className='text-muted-foreground text-xs font-medium'>{course.code}</p>
                  <h3 className='line-clamp-1 text-sm font-semibold text-gray-900'>{course.title}</h3>
                  <p className='line-clamp-2 text-xs text-gray-600'>{course.description}</p>
                </div>

                <div className='mt-auto flex flex-wrap items-center gap-2'>
                  <Badge className='bg-sky-custom-300'>{course.ageRangeLabel}</Badge>
                  <Badge className={getLevelBadgeClass(course.level)}>{capitalizeFirst(course.level)}</Badge>
                </div>
              </CardLayout>
            </Link>

            {userRole === UserRole.STAFF && (
              <div key={course.id} className='absolute top-2 right-2 flex flex-col items-center justify-center gap-1'>
                <SDropDown
                  trigger={
                    <EllipsisVertical className='mt-2 h-5 w-5 text-white hover:scale-[1.1] hover:text-yellow-400' />
                  }
                  items={[
                    <p key={`update-${course.id}`} className='text-sm' onClick={() => handleNavigate(course.id)}>
                      {tc('button.update')}
                    </p>,
                    <button key={`delete-${course.id}`} className='text-sm' onClick={(e) => handleDelete(e, course.id)}>
                      {tc('button.delete')}
                    </button>
                  ].filter(Boolean)}
                />
              </div>
            )}
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
