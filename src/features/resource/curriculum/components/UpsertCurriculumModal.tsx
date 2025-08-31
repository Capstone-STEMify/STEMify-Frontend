import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import UpsertCurriculum from './UpsertCurriculum'
import { useTranslations } from 'next-intl'
interface UpsertCurriculumModalProps {
  id?: number
  onConfirm?: () => void
}
export default function UpsertCurriculumModal({ id, onConfirm }: UpsertCurriculumModalProps) {
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
      <DialogTitle></DialogTitle>

      <DialogContent className='flex h-[90vh] w-full flex-col'>
        <DialogHeader className='shrink-0'>
          <DialogTitle>{t('form.title.create')}</DialogTitle>
        </DialogHeader>
        <div className='flex-1 overflow-y-auto px-4'>
          <UpsertCurriculum curriculumId={id} onSuccess={handleSuccess} inModal />
        </div>
      </DialogContent>
    </Dialog>
  )
}
