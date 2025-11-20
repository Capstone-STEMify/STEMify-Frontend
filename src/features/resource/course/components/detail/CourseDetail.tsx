'use client'

import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useSearchCourseEnrollmentQuery } from '@/features/enrollment/api/courseEnrollmentApi'
import CourseDetailEnrolled from '@/features/resource/course/components/detail/enrolled/CourseDetailEnrolled'
import CourseDetailNotEnrolled from '@/features/resource/course/components/detail/not-enrolled/CourseDetailNotEnrolled'
import { useAppSelector } from '@/hooks/redux-hooks'
import { LicenseType, UserRole } from '@/types/userRole'
import { useParams } from 'next/navigation'

export default function CourseDetail() {
  const param = useParams()
  const courseIdParam = param?.courseId
  const courseId = courseIdParam ? Number(courseIdParam) : undefined

  const userRole = useAppSelector((state) => state.selectedOrganization.currentRole)
  const studentId = useAppSelector((state) => state.auth.user?.userId)

  const { data, isLoading, error } = useSearchCourseEnrollmentQuery(
    { pageNumber: 1, pageSize: 10, courseId, studentId },
    { skip: !studentId }
  )

  if (isLoading) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }
  if (error) {
    return <p>Error: {(error as any)?.message ?? 'Unknown error'}</p>
  }

  const enrollmentItems = data?.data?.items ?? []
  const firstEnrollment = enrollmentItems[0]

  if (firstEnrollment) {
    return <CourseDetailEnrolled courseId={Number(courseId)} enrollmentId={firstEnrollment.id} />
  }

  if (userRole === LicenseType.TEACHER) {
    return <CourseDetailEnrolled courseId={Number(courseId)} enrollmentId={firstEnrollment} />
  }

  return <CourseDetailNotEnrolled />
}
