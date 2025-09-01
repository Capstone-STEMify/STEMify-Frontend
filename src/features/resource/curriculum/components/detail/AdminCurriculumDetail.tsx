'use client'
import { Button } from '@/components/shadcn/button'
import BackButton from '@/components/shared/button/BackButton'
import AdminCurriculumCourseList from '@/features/resource/curriculum/components/list/AdminCurriculumCourseList'
import UpsertCurriculum from '@/features/resource/curriculum/components/upsert/UpsertCurriculum'
import LearningOutcomeTable from '@/features/resource/learning-outcome/components/list/LearningOutcomeTable'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import CurriculumInformationSection from './CurriculumInformationSection'

export default function AdminCurriculumDetail() {
  const t = useTranslations('curriculum')
  const [isEditing, setIsEditing] = useState(false)
  const { curriculumId } = useParams()
  const { openModal } = useModal()

  const handleEdit = () => {
    setIsEditing(true)
  }
  return (
    <div>
      <div className='flex items-center gap-5 pb-5'>
        {!isEditing ? <BackButton /> : <BackButton onClick={() => setIsEditing(false)} />}
        <h1>{isEditing ? t('form.title.update') : t('details.title')}</h1>
      </div>

      {!isEditing ? (
        <CurriculumInformationSection onEdit={handleEdit} />
      ) : (
        <UpsertCurriculum curriculumId={Number(curriculumId)} />
      )}

      {curriculumId && (
        <>
          <hr className='my-10' />

          <LearningOutcomeTable curriculumId={Number(curriculumId)} />

          <hr className='my-10' />

          <AdminCurriculumCourseList curriculumId={Number(curriculumId)} />
        </>
      )}
    </div>
  )
}
