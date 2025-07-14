'use client'

import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useSearchEnrollmentQuery } from '@/features/enrollment/api/enrollmentApi'
import CourseDetailEnrolled from '@/features/resource/course/components/detail/CourseDetailEnrolled'
import CourseDetailNotEnrolled from '@/features/resource/course/components/detail/CourseDetailNotEnrolled'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useParams } from 'next/navigation'

export default function CourseDetail() {
  const auth = useAppSelector((state) => state.auth)
  const param = useParams()
  const courseIdParam = param?.courseId
  const courseId = courseIdParam ? Number(courseIdParam) : undefined
  const token = auth.token
  const studentId = auth.user?.userId
  console.log('CourseDetail', { auth, token })

  const { data, isLoading, error } = useSearchEnrollmentQuery(
    {
      courseId,
      studentId
    },
    { skip: !token || !courseId }
  )
  const enrollmentItems = data?.data?.items ?? []

  if (isLoading)
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  if (error) return <p>Error: {(error as any).message ?? 'Unknown error'}</p>

  if (enrollmentItems.length > 0) {
    return <CourseDetailEnrolled courseId={Number(courseId)} token={token ?? undefined} />
  }

  return <CourseDetailNotEnrolled courseId={Number(courseId)} token={token ?? undefined} />
}
