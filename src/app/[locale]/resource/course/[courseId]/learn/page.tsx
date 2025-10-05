'use client'
import CourseDetailEnrolled from '@/features/resource/course/components/detail/enrolled/CourseDetailEnrolled'
import { useParams, useSearchParams } from 'next/navigation'
import React from 'react'

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const searchParams = useSearchParams()
  const enrollmentId = searchParams.get('enrollmentId')

  return <CourseDetailEnrolled courseId={Number(courseId)} enrollmentId={Number(enrollmentId)} />
}
