'use client'
import BackButton from '@/components/shared/button/BackButton'
import LearningOutcomeTable from '@/features/resource/learning-outcome/components/list/LearningOutcomeTable'
import { useTranslations } from 'next-intl'
import React from 'react'
import KitListSection from '@/features/resource/kit/components/list/KitListSection'
import OrganizationCourseList from '@/features/resource/course/components/list/OrganizationCourseList'
import OrganizationCurriculumInfoSection from '@/features/resource/curriculum/components/detail/OrganizationCurriculumInfoSection'
import { useAppSelector } from '@/hooks/redux-hooks'
import SEmpty from '@/components/shared/empty/SEmpty'

export default function OrganizationCurriculumDetail() {
  const t = useTranslations('curriculum')
  const curriculum = useAppSelector((state) => state.selectedCurriculum.selectedCurriculum)

  if (!curriculum) {
    return <SEmpty title={t('details.noCurriculumSelected')} description={t('details.pleaseSelectCurriculum')} />
  }
  return (
    <div>
      <div className='mx-auto min-h-screen max-w-6xl px-4 pb-8 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-5 pb-5'>
          <BackButton />
          <h1>{t('details.title')}</h1>
        </div>
        <OrganizationCurriculumInfoSection curriculum={curriculum} />

        <>
          <hr className='my-10' />
          <LearningOutcomeTable curriculumId={Number(curriculum.id)} />
          <hr className='my-10' />
          <KitListSection context='curriculum' kitIds={[]} />
          <hr className='my-10' />
          <OrganizationCourseList courses={curriculum.courses || []} />
        </>
      </div>
    </div>
  )
}
