import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

type AdminCurriculumCourseListProps = {
  curriculumId: number
}

export default function AdminCurriculumCourseList({ curriculumId }: AdminCurriculumCourseListProps) {
  const { openModal } = useModal()
  const t = useTranslations('curriculum')
  return (
    <div>
      <h2 className='text-center text-3xl'>{t('list.courseListTitle')}</h2>
      <Button
        className='bg-amber-custom-400'
        onClick={() => {
          openModal('courseList', { curriculumId })
        }}
      >
        <Plus className='mr-1 h-4 w-4' />
        {t('details.addCourse')}
      </Button>
    </div>
  )
}
