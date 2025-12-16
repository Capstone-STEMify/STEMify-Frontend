'use client'
import CourseDetailEnrolled from '@/features/resource/course/components/detail/enrolled/CourseDetailEnrolled'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useLocale } from 'next-intl'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const router = useRouter()
  const locale = useLocale()

  const { courseEnrollmentId } = useAppSelector((state) => state.enrollment)
  console.log('courseEnrollmentId:', courseEnrollmentId)
  if (!courseEnrollmentId) router.push(`/${locale}/unauthorized`)
  return <CourseDetailEnrolled courseId={Number(courseId)} enrollmentId={Number(courseEnrollmentId)} />
}
