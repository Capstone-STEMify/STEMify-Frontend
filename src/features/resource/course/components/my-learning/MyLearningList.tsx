'use client'

import React, { useEffect, useMemo } from 'react'
import { BookOpen } from 'lucide-react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useTranslations } from 'next-intl'
import { useSearchCourseEnrollmentQuery } from '@/features/enrollment/api/courseEnrollmentApi'
import { Accordion } from '@/components/shadcn/accordion'
import { SpecializationCard } from '@/features/certificate/certificate-list/components/specialization/SpecializationCard'
import { useSearchCurriculumEnrollmentQuery } from '@/features/enrollment/api/curriculumEnrollmentApi'
import { CourseCard } from '@/features/certificate/certificate-list/components/course/CourseCard'

type MyLearningListProps = {
  studentId?: string
}

export function MyLearningList({ studentId }: MyLearningListProps) {
  const t = useTranslations('MyLearning')

  const courseEnrollParams = useAppSelector((state) => state.courseEnrollment)
  const curriculumEnrollParams = useAppSelector((state) => state.curriculumEnrollment)

  const { data: courseEnrollment, isLoading: isLoadingCourseEnrollment } = useSearchCourseEnrollmentQuery(
    { studentId, ...courseEnrollParams },
    { skip: !studentId }
  )
  const { data: curriculumEnrollment, isLoading: isLoadingCurriculumEnrollment } = useSearchCurriculumEnrollmentQuery(
    { studentId, ...curriculumEnrollParams },
    { skip: !studentId }
  )

  const filteredCourseEnrollment = useMemo(() => {
    if (!courseEnrollment || !curriculumEnrollment) return courseEnrollment?.data.items ?? []

    // Tập hợp tất cả courseId nằm trong curriculumEnrollment
    const curriculumCourseIds = new Set(
      curriculumEnrollment.data.items.flatMap((c) => c.courseEnrollments?.map((ce) => ce.courseId) ?? [])
    )

    // Lọc những courseEnrollment không thuộc curriculum
    return courseEnrollment.data.items.filter((ce) => !curriculumCourseIds.has(ce.courseId))
  }, [courseEnrollment, curriculumEnrollment])

  if (isLoadingCourseEnrollment || isLoadingCurriculumEnrollment) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  if (!courseEnrollment && !curriculumEnrollment) {
    return (
      <SEmpty
        title={t('noEnrollments')}
        description={t('noCourses')}
        icon={<BookOpen className='h-12 w-12 text-gray-400' />}
      />
    )
  }
  return (
    <div className='space-y-4'>
      <div className='mb-10 space-y-2 text-center'>
        <h1 className='text-4xl'>{t('title')}</h1>
        <p className='text-2xl text-gray-600'>{t('subtitle')}</p>
      </div>
      <div className='min-h-screen bg-transparent p-4 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-7xl space-y-10'>
          {curriculumEnrollment && (
            <section>
              <h2 className='mb-4 text-2xl font-semibold text-gray-600'>{t('myCurriculums')}</h2>
              <Accordion type='single' collapsible className='w-full space-y-3'>
                {curriculumEnrollment.data.items.map((curriculum, index) => (
                  <SpecializationCard key={index} itemValue={`item-${index}`} curriculum={curriculum} />
                ))}
              </Accordion>
            </section>
          )}

          {filteredCourseEnrollment && filteredCourseEnrollment.length > 0 && (
            <section>
              <h2 className='mb-4 text-2xl font-semibold text-gray-600'>{t('myCourses')}</h2>
              <div className='space-y-3'>
                {filteredCourseEnrollment.map((course, index) => (
                  <CourseCard key={index} course={course} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
