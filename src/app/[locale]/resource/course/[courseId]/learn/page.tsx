'use client'
import CourseDetailEnrolled from '@/features/resource/course/components/detail/enrolled/CourseDetailEnrolled'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useParams, useSearchParams } from 'next/navigation'
import React from 'react'

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const { courseEnrollmentId } = useAppSelector((state) => state.enrollment)

  return <CourseDetailEnrolled courseId={Number(courseId)} enrollmentId={Number(courseEnrollmentId)} />
}
