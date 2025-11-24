'use client'
import { Accordion } from '@/components/shadcn/accordion'
import { accomplishmentsData } from '../../api/mockData'
import { SpecializationCard } from './SpecializationCard'
import { CourseCard } from './CourseCard'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useSearchCourseEnrollmentQuery } from '@/features/enrollment/api/courseEnrollmentApi'
import { useEffect } from 'react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import { BookOpen } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchCurriculumEnrollmentQuery } from '@/features/enrollment/api/curriculumEnrollmentApi'

export default function Accomplishment() {
  const t = useTranslations('MyLearning')

  const auth = useAppSelector((state) => state.auth)
  const studentId = auth.user?.userId
  const { specializations, courses } = accomplishmentsData
  const dispatch = useAppDispatch()

  // const courseEnrollParams = useAppSelector((state) => state.courseEnrollment)
  // const curriculumEnrollParams = useAppSelector((state) => state.curriculumEnrollment)

  const { data: courseEnrollment, isLoading: isLoadingCourseEnrollment } = useSearchCourseEnrollmentQuery(
    { studentId },
    { skip: !studentId }
  )
  const { data: curriculumEnrollment, isLoading: isLoadingCurriculumEnrollment } = useSearchCurriculumEnrollmentQuery(
    { studentId },
    { skip: !studentId }
  )

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
    <main className='min-h-screen bg-transparent p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-7xl space-y-10'>
        {curriculumEnrollment && (
          <section>
            <h2 className='mb-4 text-2xl font-semibold text-gray-600'>My Curriculums</h2>
            <Accordion type='single' collapsible className='w-full space-y-3'>
              {curriculumEnrollment.data.items.map((curriculum, index) => (
                <SpecializationCard key={index} itemValue={`item-${index}`} curriculum={curriculum} />
              ))}
            </Accordion>
          </section>
        )}

        {courseEnrollment && (
          <section>
            <h2 className='mb-4 text-2xl font-semibold text-gray-600'>My Courses</h2>
            <div className='space-y-3'>
              {courseEnrollment.data.items.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
