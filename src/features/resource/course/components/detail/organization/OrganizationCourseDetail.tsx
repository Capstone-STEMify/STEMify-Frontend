'use client'

import React, { useState } from 'react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import { BookOpen } from 'lucide-react'
import { useGetCourseByIdQuery } from '@/features/resource/course/api/courseApi'
import ContentSection from '@/features/resource/course/components/detail/not-enrolled/ContentSection'
import StatsSection from '@/features/resource/course/components/detail/not-enrolled/StatSection'
import LearningObjectives from '@/components/shared/outcome/LearningObjectives'
import { useSearchLearningOutcomeQuery } from '@/features/resource/learning-outcome/api/learningOutcomeApi'
import { useTranslations } from 'next-intl'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useParams } from 'next/navigation'
import { useSearchCourseEnrollmentQuery } from '@/features/enrollment/api/courseEnrollmentApi'
import OrganizationCourseHeroSection from '@/features/resource/course/components/detail/organization/OrganizationCourseHeroSection'
import OrganizationCourseClassroom from '@/features/resource/course/components/detail/organization/OrganizationCourseClassroom'

export default function OrganizationCourseDetail() {
  const auth = useAppSelector((state) => state.auth)
  const studentId = auth?.user?.userId
  const tc = useTranslations('common.message')
  const to = useTranslations('organization')

  const { courseId } = useParams()

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

  const [activeTab, setActiveTab] = useState<'lesson' | 'classroom'>('lesson')

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
    <div>
      <div className='relative'>
        <OrganizationCourseHeroSection course={course.data} />
        <StatsSection course={course.data} />
      </div>

      <div className='mt-30 sm:mt-32'>
        <LearningObjectives title={tc('learnTitle')} outcomes={LearningOutcome?.data.items} />
      </div>

      <hr className='mx-auto my-5 w-sm text-gray-600' />

      <div className='mx-auto max-w-7xl px-4 pb-5 sm:px-6 lg:px-8'>
        <div className='flex gap-6 border-b border-gray-200'>
          <button
            className={`py-2 text-lg font-medium transition-all ${activeTab === 'lesson' ? 'text-blue-600' : 'text-gray-500'} relative`}
            onClick={() => setActiveTab('lesson')}
          >
            {to('lesson')}
            {activeTab === 'lesson' && (
              <span className='absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-blue-600'></span>
            )}
          </button>

          <button
            className={`py-2 text-lg font-medium transition-all ${activeTab === 'classroom' ? 'text-blue-600' : 'text-gray-500'} relative`}
            onClick={() => setActiveTab('classroom')}
          >
            {to('classroom')}
            {activeTab === 'classroom' && (
              <span className='absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-blue-600'></span>
            )}
          </button>
        </div>

        <div>
          {activeTab === 'lesson' && <ContentSection />}
          {activeTab === 'classroom' && <OrganizationCourseClassroom />}
        </div>
      </div>
    </div>
  )
}
