import CurriculumAction from '@/features/resource/curriculum/components/list/CurriculumAction'
import CurriculumList from '@/features/resource/curriculum/components/list/AdminCurriculumList'
import React from 'react'
import { useTranslations } from 'next-intl'

export default function AdminCurriculum() {
  const t = useTranslations('curriculum')
  return (
    <div className='px-5'>
      <h1 className='text-2xl font-semibold text-gray-800'>{t('list.title')}</h1>
      <CurriculumAction />
      <CurriculumList />
    </div>
  )
}
