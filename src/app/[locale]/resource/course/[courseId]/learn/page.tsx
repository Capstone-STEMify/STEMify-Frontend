'use client'
import CourseDetailEnrolled from '@/features/resource/course/components/detail/enrolled/CourseDetailEnrolled'
import { useAppSelector } from '@/hooks/redux-hooks'
import { UserRole } from '@/types/userRole'
import { useLocale } from 'next-intl'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const router = useRouter()
  const locale = useLocale()
  const { user } = useAppSelector((state) => state.auth)

  const { courseEnrollmentId } = useAppSelector((state) => state.enrollment)
  if (!courseEnrollmentId && user?.userRole !== UserRole.ADMIN && user?.userRole !== UserRole.STAFF)
    router.push(`/${locale}/unauthorized`)
  return <CourseDetailEnrolled courseId={Number(courseId)} enrollmentId={Number(courseEnrollmentId)} />
}
