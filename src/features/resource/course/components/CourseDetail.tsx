'use client'

import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useSearchEnrollmentQuery } from '@/features/enrollment/api/enrollmentApi'
import CourseDetailEnrolled from '@/features/resource/course/components/detail/CourseDetailEnrolled'
import CourseDetailNotEnrolled from '@/features/resource/course/components/detail/CourseDetailNotEnrolled'
import { useAppSelector } from '@/hooks/redux-hooks'
import { UserRole } from '@/types/userRole'
import { useParams } from 'next/navigation'

export default function CourseDetail() {
  const param = useParams()
  const courseIdParam = param?.courseId
  const courseId = courseIdParam ? Number(courseIdParam) : undefined

  const auth = useAppSelector((state) => state.auth)
  const studentId = auth?.user?.userId
  const userRole = auth?.user?.role || UserRole.GUEST

  const { data, isLoading, error } = useSearchEnrollmentQuery({ courseId, studentId }, { skip: !studentId })

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

  if (userRole === UserRole.ADMIN) {
    return <CourseDetailEnrolled courseId={Number(courseId)} enrollmentId={firstEnrollment} />
  }

  return <CourseDetailNotEnrolled courseId={Number(courseId)} />
}
