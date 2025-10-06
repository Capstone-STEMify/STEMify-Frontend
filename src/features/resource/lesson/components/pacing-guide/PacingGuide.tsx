'use client'
import React from 'react'
import { useGetLessonByIdQuery } from '@/features/resource/lesson/api/lessonApi'
import SEmpty from '@/components/shared/empty/SEmpty'
import { useParams } from 'next/navigation'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import GuideLessonDetails from '@/features/resource/lesson/components/pacing-guide/GuideLessonDetails'
import SectionListTable from '@/features/resource/section/components/list/SectionListTable'
import { useLocale, useTranslations } from 'next-intl'
import BackButton from '@/components/shared/button/BackButton'

export default function PacingGuide({ isModal = false }: { isModal?: boolean }) {
  const t = useTranslations('LessonDetails')
  const locale = useLocale()
  const { lessonId } = useParams()
  const { data, isLoading } = useGetLessonByIdQuery(Number(lessonId), { skip: !lessonId })

  if (isLoading)
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )

  if (!data) {
    return <SEmpty title='No lesson found' description='Please try again later.' />
  }

  return (
    <div className='mx-auto min-h-screen max-w-6xl px-4 pt-2 sm:px-6 lg:px-8'>
      <div className='flex items-center gap-5 pb-5'>
        {!isModal && <BackButton url={`/${locale}/admin/course/${data?.data.courseId}`} />}
        <h1>{t('title')}</h1>
      </div>
      <div>
        <GuideLessonDetails lesson={data?.data} />
        <SectionListTable lessonId={Number(lessonId)} />
      </div>
    </div>
  )
}
