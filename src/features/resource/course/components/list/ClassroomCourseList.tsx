'use client'
import { useSearchCourseQuery } from '@/features/resource/course/api/courseApi'
import { useParams, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { BookOpen, Clock, User, GraduationCap, Play, MoreVertical } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getLevelBadgeClass } from '@/utils/badgeColor'
import CardLayout from '@/components/shared/card/CardLayout'
import { formatDuration } from '@/utils/index'

export default function ClassroomCourseList() {
  const { classroomId } = useParams()
  const searchParams = useSearchParams()
  const curriculumId = searchParams.get('curriculumId')
  const { data, isLoading } = useSearchCourseQuery({ curriculumId: Number(curriculumId) })

  const courses = data?.data.items || []
  const totalCount = data?.data.totalCount || 0

  if (isLoading) {
    return (
      <div className='container mx-auto px-6 py-8'>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <div className='mb-2 flex items-center justify-between'>
          <div>
            <h2 className='text-3xl font-bold text-slate-900'>Courses</h2>
            <p className='mt-1 text-slate-600'>
              {totalCount} {totalCount === 1 ? 'course' : 'courses'} available
            </p>
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
              href={`/classroom/${classroomId}/course/${course.id}`}
              imageSrc={course.imageUrl}
              imageRatio='aspect-video'
              badge={<Badge className={`border ${getLevelBadgeClass(course.level)}`}>{course.level}</Badge>}
              
              footer={
                <Button className='mt-2 w-full bg-blue-600 hover:bg-blue-700' size='sm'>
                  <Play className='mr-2 h-4 w-4' />
                  Start Course
                </Button>
              }
              children={
                <div>
                  <div className='flex justify-between space-y-2'>
                    {/* Title */}
                    <h3 className='line-clamp-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600'>
                      {course.title}
                    </h3>
                    {/* Code */}
                    <div className='flex items-center gap-2'>
                      <Badge variant='secondary' className='border-0 bg-slate-100 font-mono text-xs text-slate-700'>
                        {course.code}
                      </Badge>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    {/* Description */}
                    <p className='line-clamp-3 text-sm text-slate-600'>{course.description}</p>

                    {/* Meta Info */}
                    <div className='grid grid-cols-2 gap-3 pt-2'>
                      {/* Duration */}
                      <div className='flex items-center gap-2 text-sm text-slate-600'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50'>
                          <Clock className='h-4 w-4 text-blue-600' />
                        </div>
                        <div>
                          <p className='text-xs text-slate-500'>Duration</p>
                          <p className='font-semibold text-slate-700'>{formatDuration(course.duration)}</p>
                        </div>
                      </div>

                      {/* Lessons */}
                      <div className='flex items-center gap-2 text-sm text-slate-600'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50'>
                          <BookOpen className='h-4 w-4 text-purple-600' />
                        </div>
                        <div>
                          <p className='text-xs text-slate-500'>Lessons</p>
                          <p className='font-semibold text-slate-700'>{course.lessonIds.length}</p>
                        </div>
                      </div>
                    </div>

                    {/* Age Range */}
                    <div className='flex items-center gap-2 border-t border-slate-100 pt-2'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50'>
                        <GraduationCap className='h-4 w-4 text-amber-600' />
                      </div>
                      <div className='flex-1'>
                        <p className='text-xs text-slate-500'>Age Range</p>
                        <p className='text-sm font-semibold text-slate-700'>{course.ageRangeLabel} years old</p>
                      </div>
                      {/* Created by */}
                      <div className='flex items-center gap-1.5'>
                        <User className='h-3.5 w-3.5 text-slate-400' />
                        <p className='line-clamp-1 text-xs text-slate-500'>{course.createdByUserName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
