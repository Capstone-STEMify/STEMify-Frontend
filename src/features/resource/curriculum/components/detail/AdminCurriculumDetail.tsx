'use client'
import BackButton from '@/components/shared/button/BackButton'
import AdminCurriculumCourseList from '@/features/resource/curriculum/components/list/AdminCurriculumCourseList'
import LearningOutcomeTable from '@/features/resource/learning-outcome/components/list/LearningOutcomeTable'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React from 'react'
import AdminCurriculumInformationSection from './AdminCurriculumInformationSection'
import { useGetCurriculumByIdQuery } from '@/features/resource/curriculum/api/curriculumApi'
import SEmpty from '@/components/shared/empty/SEmpty'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import KitListSection from '@/features/resource/kit/components/list/KitListSection'
import AdminCurriculumEmulatorList from '@/features/resource/curriculum/components/list/AdminCurriculumEmulatorList'

export default function AdminCurriculumDetail() {
  const { curriculumId } = useParams()
  const t = useTranslations('curriculum')
  const { data, isLoading } = useGetCurriculumByIdQuery(Number(curriculumId), {
    skip: !Number(curriculumId),
    refetchOnMountOrArgChange: true
  })

  if (isLoading) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }
  if (!data) return <SEmpty title='No Curriculum Found' description='Please check the curriculum and try again.' />

  return (
    <div>
      <div className='mx-auto min-h-screen max-w-6xl px-4 pb-8 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-5 pb-5'>
          <BackButton />
          <h1>{t('details.title')}</h1>
        </div>
        <AdminCurriculumInformationSection curriculumId={Number(curriculumId)} curriculum={data?.data} />

        {curriculumId && (
          <>
            <hr className='my-10' />
            <LearningOutcomeTable curriculumId={Number(curriculumId)} />
            <hr className='my-10' />
            <KitListSection context='curriculum' kitIds={data?.data?.kitIds || []} />
            <hr className='my-10' />
            <AdminCurriculumCourseList curriculumId={Number(curriculumId)} courses={data?.data?.courses} />
            <hr className='my-10' />
            <AdminCurriculumEmulatorList curriculumId={Number(curriculumId)} emulations={data.data.emulations} />
          </>
        )}
      </div>
    </div>
  )
}
