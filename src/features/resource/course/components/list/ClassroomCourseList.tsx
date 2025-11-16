'use client'
import { useGetCurriculumByIdQuery } from '@/features/resource/curriculum/api/curriculumApi'
import { useParams, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { BookOpen, Clock, User, GraduationCap } from 'lucide-react'
import React from 'react'
import { getLevelBadgeClass } from '@/utils/badgeColor'
import CardLayout from '@/components/shared/card/CardLayout'
import { formatDuration } from '@/utils/index'
import { ClassroomSchedule } from '@/features/classroom/components/schedule/ClassroomSchedule'
import { Course, CourseLevel, CourseStatus } from '@/features/resource/course/types/course.type'

export default function ClassroomCourseList() {
  const { classroomId } = useParams()
  const searchParams = useSearchParams()
  const curriculumId = searchParams.get('curriculumId')
  const { data, isLoading } = useGetCurriculumByIdQuery(Number(curriculumId))

  const courses = data?.data.courses || []
  const totalCount = data?.data.courseCount || 0

  if (isLoading) {
    return (
      <div className='container mx-auto px-6 py-8'>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className='h-96 animate-pulse rounded-xl bg-slate-100' />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-6 pb-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='my-6 flex items-center justify-between'>
          <div className='flex gap-6'>
            <h2 className='text-3xl font-bold text-slate-900'>Courses</h2>
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
          {courses.map((course) => (
            <CardLayout
              key={course.id}
              href={`/resource/course/${course.id}`}
              imageSrc={course.imageUrl}
              imageRatio='aspect-video'
              badge={
                <Badge className={getLevelBadgeClass(course.level.toUpperCase() as CourseLevel)}>{course.level}</Badge>
              }
              action={
                <Badge variant='secondary' className='flex items-center gap-1 py-0.5'>
                  <Clock className='h-3 w-3 text-blue-600' />
                  <span className='text-xs'>{formatDuration(course.duration)}</span>
                </Badge>
              }
              footer={<div className='flex w-full items-center gap-2 border-t border-slate-100 pt-2'></div>}
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
                    <p className='text-xs font-semibold text-slate-700'>{course.ageRangeLabel} years old</p>
                  </div>
                </div>

                <div className='space-y-4'>
                  <p className='line-clamp-3 text-sm text-slate-600'>{course.description}</p>
                </div>
              </div>
            </CardLayout>
          ))}
        </div>
      )}

      <div className='mb-8'>
        <div className='my-6 flex items-center justify-between'>
          <div className='flex gap-6'>
            <h2 className='text-3xl font-bold text-slate-900'>Classroom Schedule</h2>
          </div>
        </div>
      </div>
      <ClassroomSchedule classroomId={Number(classroomId)} />
    </div>
  )
}
