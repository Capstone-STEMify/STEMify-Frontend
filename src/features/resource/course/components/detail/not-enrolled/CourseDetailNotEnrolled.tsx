'use client'
import React from 'react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import { BookOpen } from 'lucide-react'
import { useGetCourseByIdQuery } from '@/features/resource/course/api/courseApi'
import ContentSection from '@/features/resource/course/components/detail/not-enrolled/ContentSection'
import StatsSection from '@/features/resource/course/components/detail/not-enrolled/StatSection'
import HeroSection from '@/features/resource/course/components/detail/not-enrolled/HeroSection'
import LearningObjectives from '@/components/shared/outcome/LearningObjectives'
import { useSearchLearningOutcomeQuery } from '@/features/resource/learning-outcome/api/learningOutcomeApi'
import { useTranslations } from 'next-intl'
import { useAppSelector } from '@/hooks/redux-hooks'
import { UserRole } from '@/types/userRole'
import { useParams } from 'next/navigation'
import { useSearchCourseEnrollmentQuery } from '@/features/enrollment/api/courseEnrollmentApi'

export default function CourseDetailNotEnrolled() {
  const auth = useAppSelector((state) => state.auth)
  const studentId = auth?.user?.userId
  const tc = useTranslations('common.message')

  const { courseId } = useParams()
  const params = useAppSelector((state) => state.courseEnrollment) as
    | { pageNumber?: number; pageSize?: number }
    | undefined
  const { data: course, error, isLoading } = useGetCourseByIdQuery(Number(courseId))
  const {
    data: LearningOutcome,
    isLoading: outcomeLoading,
    isFetching: outcomeFetching
  } = useSearchLearningOutcomeQuery({ courseId: Number(courseId) })

  const {
    data: enrollmentData,
    isLoading: enrollmentLoading,
    error: enrollmentError
  } = useSearchCourseEnrollmentQuery({ courseId: Number(courseId), studentId }, { skip: !studentId })

  if (isLoading || outcomeLoading || outcomeFetching || enrollmentLoading)
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  if (error) return <div className='p-8 text-red-500'>Error loading course details.</div>
  if (!course?.data)
    return (
      <div className='flex h-screen items-center justify-center bg-white'>
        <SEmpty
          title='Course not found'
          description='The course you are looking for does not exist or has been removed.'
          icon={<BookOpen className='h-12 w-12 text-gray-400' />}
        />
      </div>
    )

  return (
    <div className='min-h-screen bg-white'>
      <div className='relative'>
        <HeroSection
          course={course.data}
          enrollmentStatus={enrollmentData?.data.items[0]?.status}
          enrollmentId={enrollmentData?.data.items[0]?.id}
        />
        <StatsSection course={course.data} />
      </div>
      <div className='mt-30 sm:mt-32'>
        <LearningObjectives title={tc('learnTitle')} outcomes={LearningOutcome?.data.items} />
      </div>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <ContentSection />
      </div>
    </div>
  )
}
