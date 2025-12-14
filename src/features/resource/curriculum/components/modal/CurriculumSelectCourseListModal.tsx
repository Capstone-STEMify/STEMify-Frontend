import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import AdminCurriculumSelectCourseList from '@/features/resource/curriculum/components/modal/AdminCurriculumSelectCourseList'
import { useTranslations } from 'next-intl'

interface CourseListModalProps {
  curriculumId: number
  onConfirm?: () => void
  courseIds?: number[]
}

export default function CurriculumSelectCourseListModal({ curriculumId, onConfirm, courseIds }: CourseListModalProps) {
  const t = useTranslations('curriculum')
  const { closeModal } = useModal()

  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='h-fit w-full max-w-4xl'>
        <DialogTitle>{t('custom.selectCourseTitle')}</DialogTitle>

        <AdminCurriculumSelectCourseList curriculumId={curriculumId} onSuccess={handleSuccess} courseIds={courseIds} />
      </DialogContent>
    </Dialog>
  )
}
