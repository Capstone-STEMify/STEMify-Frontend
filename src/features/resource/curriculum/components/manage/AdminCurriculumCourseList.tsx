import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

type AdminCurriculumCourseListProps = {
  curriculumId: number
}

export default function AdminCurriculumCourseList({ curriculumId }: AdminCurriculumCourseListProps) {
  const { openModal } = useModal()
  const t = useTranslations('Curriculum')
  const tc = useTranslations('common')
  return (
    <div>
      <h2 className='text-center text-3xl'>{t('courseList.title')}</h2>
      <Button
        onClick={() => {
          openModal('courseList', { curriculumId })
        }}
      >
        {tc('button.addCourse')}
      </Button>
    </div>
  )
}
