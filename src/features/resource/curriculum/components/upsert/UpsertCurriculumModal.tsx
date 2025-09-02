import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { useTranslations } from 'next-intl'
import UpsertCurriculum from './UpsertCurriculum'
import { ScrollArea } from '@/components/shadcn/scroll-area'
interface UpsertCurriculumModalProps {
  id?: number
  onConfirm: () => void
}
export default function UpsertCurriculumModal({ id, onConfirm }: UpsertCurriculumModalProps) {
  const tc = useTranslations('common')

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
      <DialogContent className='flex w-full flex-col lg:w-[660px]'>
        <DialogHeader className='shrink-0'>
          <DialogTitle>{t('form.title.create')}</DialogTitle>
        </DialogHeader>
        <hr />
        <ScrollArea className='h-[500px]'>
          <UpsertCurriculum curriculumId={id} onSuccess={handleSuccess} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
