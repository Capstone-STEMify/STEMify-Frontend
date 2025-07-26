'use client'
import React from 'react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import { BookOpen } from 'lucide-react'
import { useGetCourseByIdQuery } from '@/features/resource/course/api/courseApi'
import ContentSection from '@/features/resource/course/components/detail/not-enrolled/ContentSection'
import StatsSection from '@/features/resource/course/components/detail/not-enrolled/StatSection'
import HeroSection from '@/features/resource/course/components/detail/not-enrolled/HeroSection'

type CourseDetailNotEnrolledProps = {
  courseId?: number
}

export default function CourseDetailNotEnrolled({ courseId }: CourseDetailNotEnrolledProps) {
  const { data: course, error, isLoading } = useGetCourseByIdQuery(Number(courseId))

  if (isLoading)
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
        <HeroSection course={course.data} />
        <StatsSection course={course.data} />
      </div>
      <ContentSection />
    </div>
  )
}
