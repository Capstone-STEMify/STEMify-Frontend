'use client'
import BackButton from '@/components/shared/button/BackButton'
import AdminCourseDetail from '@/features/resource/course/components/detail/AdminCourseDetail'
import { useLocale, useTranslations } from 'next-intl'
import React from 'react'

export default function CourseDetailPage() {
  const locale = useLocale()
  const t = useTranslations('course')
  return (
    <div className='mx-auto min-h-screen max-w-6xl px-4 pb-8 sm:px-6 lg:px-8'>
      <div className='flex items-center gap-5 pb-5'>
        <BackButton url={`/${locale}/admin/course`} />
        <h1>{t('details.title')}</h1>
      </div>
      <AdminCourseDetail />
    </div>
  )
}
