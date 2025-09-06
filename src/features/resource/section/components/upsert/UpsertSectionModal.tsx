'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '../../../../../providers/ModalProvider'
import UpsertSection from '@/features/resource/section/components/upsert/UpsertSection'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { useTranslations } from 'next-intl'
interface ConfirmModalProps {
  lessonId: number
  sectionId: number
  onConfirm: () => void
}
export default function UpsertSectionModal({ lessonId, sectionId, onConfirm }: ConfirmModalProps) {
  const t = useTranslations('section')
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
          <DialogTitle>{sectionId ? t('form.title.update') : t('form.title.create')}</DialogTitle>
        </DialogHeader>
        <hr />
        <ScrollArea className='max-h-[450px]'>
          <UpsertSection lessonId={lessonId} sectionId={sectionId} onSuccess={handleSuccess} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
