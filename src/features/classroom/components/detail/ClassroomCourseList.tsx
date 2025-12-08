'use client'
import { useParams, useRouter } from 'next/navigation'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { BookOpen, Clock, GraduationCap } from 'lucide-react'
import React from 'react'
import CardLayout from '@/components/shared/card/CardLayout'
import { formatDuration } from '@/utils/index'
import { ClassroomSchedule } from '@/features/classroom/components/schedule/ClassroomSchedule'
import { Curriculum } from '@/features/resource/curriculum/types/curriculum.type'
import { CourseEnrollment, CurriculumEnrollment, EnrollmentStatus } from '@/features/enrollment/types/enrollment.type'
import { useCreateCourseEnrollmentMutation } from '@/features/enrollment/api/courseEnrollmentApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { setCourseEnrollmentId } from '@/features/enrollment/slice/enrollmentSlice'

type ClassroomCourseListProps = {
  curriculumEnrollment?: CurriculumEnrollment
  curriculum: Curriculum
  isStudentView?: boolean
}
export default function ClassroomCourseList({
  curriculum,
  curriculumEnrollment,
  isStudentView
}: ClassroomCourseListProps) {
  const t = useTranslations('dashboard.classroom.course')
  const tc = useTranslations('common')
  const { classroomId } = useParams()
  const router = useRouter()
  const auth = useAppSelector((state) => state.auth)
  const tt = useTranslations('toast')
  const dispatch = useAppDispatch()

  const [createEnrollment, { data: enroll }] = useCreateCourseEnrollmentMutation()

  const courses = curriculum.courses || []
  const courseEnrollments = curriculumEnrollment?.courseEnrollments || []
  const enrollmentMap = new Map<number, CourseEnrollment>()
  courseEnrollments.forEach((enrollment) => {
    enrollmentMap.set(enrollment.courseId, enrollment)
  })

  const handleCourseEnrollment = (courseId: number) => {
    createEnrollment({
      curriculumEnrollmentId: curriculumEnrollment?.id,
      courseId: courseId,
      studentId: auth?.user?.userId,
      status: EnrollmentStatus.IN_PROGRESS
    })

    dispatch(setCourseEnrollmentId(enroll?.data.id || null))
    router.push(`/resource/course/${courseId}/learn`)

    toast.success(tt('successMessage.enroll'), {
      description: `${tt('successMessage.enrollDes', { title: enroll?.data.courseTitle || '' })}`
    })
  }

  return (
    <div className='container mx-auto px-6 pb-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='my-6 flex items-center justify-between'>
          <div className='flex gap-6'>
            <h2 className='text-3xl font-bold text-slate-900'>{t('title')}</h2>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {courses.length === 0 ? (
        <div className='flex h-96 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50'>
          <BookOpen className='mb-4 h-16 w-16 text-slate-400' />
          <h3 className='mb-2 text-xl font-semibold text-slate-700'>No courses found</h3>
          <p className='mb-6 text-slate-500'>Start by adding courses to this curriculum</p>
          <Button className='bg-blue-600 hover:bg-blue-700'>Add Course</Button>
        </div>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {courses.map((course) => {
            const enrollment = enrollmentMap.get(course.id)

            return (
              <CardLayout
                key={course.id}
                imageSrc={course.imageUrl}
                imageRatio='aspect-video'
                action={
                  <Badge variant='secondary' className='flex items-center gap-1 py-0.5'>
                    <Clock className='h-3 w-3 text-blue-600' />
                    <span className='text-xs'>{formatDuration(course.totalDuration ?? 0)}</span>
                  </Badge>
                }
                footer={
                  isStudentView && (
                    <div className='flex w-full items-center gap-2 border-t border-slate-100 pt-2'>
                      {enrollment?.status ? (
                        <Button
                          onClick={() => {
                            dispatch(setCourseEnrollmentId(enrollment.id))
                            router.push(`/resource/course/${course.id}/learn`)
                          }}
                          size='sm'
                          className='w-full bg-slate-100 text-blue-500'
                        >
                          Continue Learning
                        </Button>
                      ) : (
                        <Button onClick={() => handleCourseEnrollment(course.id)} size='sm' className='w-full'>
                          Enroll Now
                        </Button>
                      )}
                    </div>
                  )
                }
              >
                <div>
                  <div className='flex flex-col justify-between space-y-2'>
                    <div className='flex justify-between'>
                      <h3 className='line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600'>
                        {course.title}
                      </h3>
                      <Badge variant='secondary' className='flex items-center py-0.5 font-mono text-xs'>
                        {course.code}
                      </Badge>
                    </div>
                    <div className='mb-1 flex items-center gap-2'>
                      <GraduationCap className='h-4 w-4 text-amber-600' />
                      <p className='text-xs font-semibold text-slate-700'>
                        {course.lessonCount} {t('lessons')}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <p className='line-clamp-3 text-sm text-slate-600'>{course.description}</p>
                  </div>
                </div>
              </CardLayout>
            )
          })}
        </div>
      )}

      <div className='mb-8'>
        <div className='my-6 flex items-center justify-between'>
          <div className='flex gap-6'>
            <h2 className='text-3xl font-bold text-slate-900'>{t('schedule')}</h2>
          </div>
        </div>
      </div>
      <ClassroomSchedule classroomId={Number(classroomId)} />
    </div>
  )
}
