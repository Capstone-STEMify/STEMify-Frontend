'use client'

import { Badge } from '@/components/shadcn/badge'
import CardLayout from '@/components/shared/card/CardLayout'
import SEmpty from '@/components/shared/empty/SEmpty'
import { SDropDown } from '@/components/shared/SDropDown'
import { SkeletonCard } from '@/components/shared/skeleton/SkeletonCard'
import { SPagination } from '@/components/shared/SPagination'
import { useSearchCourseQuery } from '@/features/resource/course/api/courseApi'
import { CourseQueryParams, CourseStatus } from '@/features/resource/course/types/course.type'
import { setPageIndex, setPageSize } from '@/features/resource/course/slice/courseSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { EllipsisVertical, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { UserRole } from '@/types/userRole'
import { useRouter } from 'next/navigation'
import { formatDuration } from '@/utils/index'

export default function CourseListContent() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const courseParams = useAppSelector((state) => state.course)
  const auth = useAppSelector((state) => state.auth)
  const userRole = auth.user?.role || UserRole.GUEST

  useEffect(() => {
    dispatch(setPageSize(12))
  }, [dispatch])

  const queryParams: CourseQueryParams = {
    courseId: courseParams.courseId,
    createdByUserId: courseParams.createdByUserId,
    ageRangeId: courseParams.ageRangeId,
    categoryId: courseParams.categoryId,
    skillId: courseParams.skillId,
    standardId: courseParams.standardId,
    pageNumber: courseParams.pageNumber,
    pageSize: courseParams.pageSize,
    search: courseParams.search,
    status: [UserRole.STUDENT, UserRole.GUEST].includes(userRole as UserRole) ? CourseStatus.PUBLISHED : undefined
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

  const handleNavigateCreateCourse = () => {
    router.push('/resource/course/create')
  }

  if (!courseData || courseData.data.items.length === 0) {
    return (
      <SEmpty
        title='No Courses Found'
        description='Try changing the search term or filters to find relevant courses.'
      />
    )
  }

  return (
    <div className='px-5 select-none'>
      <div className='grid h-fit grid-cols-1 justify-items-center gap-y-10 py-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'>
        {courseData.data.items.map((course) => (
          <div key={course.id} className='relative flex gap-1'>
            <Link href={`/resource/course/${course.id}`} className='flex w-fit flex-col justify-between'>
              <CardLayout imageSrc={course.imageUrl} size='sm'>
                <div>
                  <p className='text-muted-foreground text-xs font-medium'>Course</p>
                  <h3 className='text-sm font-semibold text-gray-900'>{course.title}</h3>
                  <p className='line-clamp-2 text-xs text-gray-600'>{course.description}</p>
                </div>

                <div className='mt-auto flex flex-wrap items-center gap-2'>
                  <Badge className='bg-sky-custom-300'>{course.ageRangeLabel}</Badge>
                  <Badge className='bg-red-300'>{formatDuration(course.duration)}</Badge>
                </div>
              </CardLayout>
            </Link>

            <div key={course.id} className='absolute top-2 right-2 flex flex-col items-center justify-center gap-1'>
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
        {userRole === UserRole.STUDENT || userRole === UserRole.GUEST ? null : (
          <div
            className='shadow-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-9.5 transition hover:scale-102 hover:border-blue-400 hover:bg-blue-50'
            onClick={handleNavigateCreateCourse}
          >
            <PlusCircle size={70} className='text-gray-500' />
            <p className='mt-4 text-sm font-medium text-gray-500'>Create New Course</p>
          </div>
        )}
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
