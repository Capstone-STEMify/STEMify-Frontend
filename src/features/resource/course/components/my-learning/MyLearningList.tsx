'use client'

import React, { useMemo } from 'react'
import { BookOpen } from 'lucide-react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useTranslations } from 'next-intl'
import { useSearchCourseEnrollmentQuery } from '@/features/enrollment/api/courseEnrollmentApi'
import { Accordion } from '@/components/shadcn/accordion'
import { SpecializationCard } from '@/features/certificate/components/list/SpecializationCard'
import { useSearchCurriculumEnrollmentQuery } from '@/features/enrollment/api/curriculumEnrollmentApi'
import { CourseCard } from '@/features/certificate/components/list/CourseCard'
import ClassroomList from '@/features/classroom/components/list/ClassroomList'
import { MyLearningSidebar } from './MyLearningSidebar'

type MyLearningListProps = {
  studentId?: string
}

export function MyLearningList({ studentId }: MyLearningListProps) {
  const t = useTranslations('myLearning')
  const tClassroom = useTranslations('classroom.myLearning')

  const { data: courseEnrollment, isLoading: isLoadingCourseEnrollment } = useSearchCourseEnrollmentQuery(
    { studentId },
    { skip: !studentId }
  )
  const { data: curriculumEnrollment, isLoading: isLoadingCurriculumEnrollment } = useSearchCurriculumEnrollmentQuery(
    { studentId },
    { skip: !studentId }
  )

  const filteredCourseEnrollment = useMemo(() => {
    if (!courseEnrollment || !curriculumEnrollment) return courseEnrollment?.data.items ?? []

    const curriculumCourseIds = new Set(
      curriculumEnrollment.data.items.flatMap((c) => c.courseEnrollments?.map((ce) => ce.courseId) ?? [])
    )

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

  const hasCurriculums = curriculumEnrollment && curriculumEnrollment.data.items.length > 0
  const hasCourses = filteredCourseEnrollment && filteredCourseEnrollment.length > 0

  return (
    <div className='bg-gray-50'>
      <div className='mx-auto max-w-[1920px] px-6'>
        <div className='flex gap-10'>
          {/* Main Content - Left Column */}
          <div className='min-w-0 flex-1'>
            {/* Classroom Section */}
            <div className='flex items-center justify-start gap-3'>
              <h2 className='text-2xl font-bold text-gray-900'>{tClassroom('title')}</h2>
            </div>
            <ClassroomList />

            {/* Curriculum Section */}
            {hasCurriculums && (
              <section className='py-10'>
                <h2 className='mb-6 text-2xl font-bold text-gray-900'>{t('myCurriculums')}</h2>
                <Accordion type='single' collapsible className='w-full space-y-3'>
                  {curriculumEnrollment.data.items.map((curriculum, index) => (
                    <SpecializationCard key={index} itemValue={`item-${index}`} curriculum={curriculum} />
                  ))}
                </Accordion>
              </section>
            )}

            {/* Courses Section */}
            {hasCourses && (
              <section className='py-10'>
                <h2 className='mb-6 text-2xl font-bold text-gray-900'>{t('myCourses')}</h2>
                <div className='space-y-3'>
                  {filteredCourseEnrollment.map((course, index) => (
                    <CourseCard key={index} course={course} />
                  ))}
                </div>
              </section>
            )}

            {/* Bottom Spacing */}
            <div className='pb-10' />
          </div>

          {/* Sidebar - Right Column */}
          {/* TODO */}
          {/* <MyLearningSidebar studentId={studentId} /> */}
        </div>
      </div>
    </div>
  )
}
