'use client'
import { Button } from '@/components/shadcn/button'
import BackButton from '@/components/shared/button/BackButton'
import CourseManagement from '@/features/resource/course/components/table/CourseManagement'
import CurriculumInformationSection from '@/features/resource/curriculum/components/CurriculumInformationSection'
import UpsertCurriculum from '@/features/resource/curriculum/components/UpsertCurriculum'
import LearningOutcomeTable from '@/features/resource/learning-outcome/components/list/LearningOutcomeTable'
import { Separator } from '@radix-ui/react-select'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { is } from 'zod/v4/locales'

export default function CurriculumDetailPage() {
  const t = useTranslations('Curriculum')
  const [isEditing, setIsEditing] = useState(false)
  const { curriculumId } = useParams()

  const handleEdit = () => {
    setIsEditing(true)
  }
  return (
    <div>
      <div className='flex items-center gap-5 pb-5'>
        {!isEditing ? <BackButton /> : <BackButton onClick={() => setIsEditing(false)} />}
        <h1>{isEditing ? t('update_title') : t('detail_title')}</h1>
      </div>

      {!isEditing ? (
        <CurriculumInformationSection onEdit={handleEdit} />
      ) : (
        <UpsertCurriculum curriculumId={Number(curriculumId)} />
      )}

      {curriculumId && (
        <>
          {/* Courses List Section */}
          <hr className='my-10' />
          {/* Learning Outcomes Section */}
          <LearningOutcomeTable curriculumId={Number(curriculumId)} />
          <hr className='my-10' />
          <h2 className='text-center text-3xl'>{t('courseList.title')}</h2>
          <CourseManagement curriculumId={Number(curriculumId)} />
        </>
      )}
    </div>
  )
}
