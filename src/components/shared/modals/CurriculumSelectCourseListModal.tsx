import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { useAppDispatch } from '@/hooks/redux-hooks'
import AdminCurriculumSelectCourseList from '@/features/resource/curriculum/components/list/AdminCurriculumSelectCourseList'
import { useTranslations } from 'next-intl'

interface CourseListModalProps {
  curriculumId: number
  onConfirm?: () => void
}

export default function CurriculumSelectCourseListModal({ curriculumId, onConfirm }: CourseListModalProps) {
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

        <AdminCurriculumSelectCourseList curriculumId={curriculumId} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
