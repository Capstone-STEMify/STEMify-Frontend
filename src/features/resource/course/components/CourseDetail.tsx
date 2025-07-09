'use client'

import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useSearchEnrollmentQuery } from '@/features/enrollment/api/enrollmentApi'
import CourseDetailEnrolled from '@/features/resource/course/components/detail/CourseDetailEnrolled'
import CourseDetailNotEnrolled from '@/features/resource/course/components/detail/CourseDetailNotEnrolled'
import { useParams } from 'next/navigation'

export default function CourseDetail() {
  const param = useParams()
  const courseIdParam = param?.courseId
  const courseId = courseIdParam ? Number(courseIdParam) : undefined

  const { data, isLoading, error } = useSearchEnrollmentQuery({
    courseId,
    studentId: '8e91a454-4753-4929-b672-a466ca2c4903'
  })
  const enrollmentItems = data?.data?.items ?? []
  console.log('CourseDetail enrollment count:', enrollmentItems.length)

  if (isLoading)
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  if (error) return <p>Error: {(error as any).message ?? 'Unknown error'}</p>

  if (enrollmentItems.length > 0) {
    return <CourseDetailEnrolled data={data} />
  }

  return <CourseDetailNotEnrolled />
}
