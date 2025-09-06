import BackButton from '@/components/shared/button/BackButton'
import CourseDetailForAdmin from '@/features/resource/course/components/detail/CourseDetailForAdmin'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function CourseDetailPage() {
  const t = useTranslations('course')
  return (
    <div className='mx-auto min-h-screen max-w-6xl px-4 pt-2 sm:px-6 lg:px-8'>
      <div className='flex items-center gap-5 pb-5'>
        <BackButton />
        <h1>{t('details.title')}</h1>
      </div>
      <CourseDetailForAdmin />
    </div>
  )
}
