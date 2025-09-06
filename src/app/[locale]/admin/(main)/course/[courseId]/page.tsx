import BackButton from '@/components/shared/button/BackButton'
import AdminCourseDetail from '@/features/resource/course/components/detail/AdminCourseDetail'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function CourseDetailPage() {
  const t = useTranslations('course')
  return (
    <div className='mx-auto px-4 pt-2 sm:px-6 lg:px-8'>
      <div className='flex items-center gap-5 pb-5'>
        <BackButton />
        <h1>{t('details.title')}</h1>
      </div>
      <AdminCourseDetail />
    </div>
  )
}
