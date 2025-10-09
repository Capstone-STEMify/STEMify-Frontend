import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent } from '@/components/shadcn/dialog'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import UpsertLesson from '@/features/resource/lesson/components/upsert/UpsertLesson'
import { useModal } from '@/providers/ModalProvider'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React from 'react'

interface UpsertLessonModalProps {
  onConfirm?: () => void
}
export default function UpsertLessonModal({ onConfirm }: UpsertLessonModalProps) {
  const { lessonId } = useParams()
  const { closeModal } = useModal()
  const t = useTranslations('LessonDetails')

  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>{lessonId ? `${t('form.title.update')}` : `${t('form.title.create')}`}</DialogTitle>
        <hr />
        <ScrollArea className='h-[500px] w-4xl pr-5'>
          <UpsertLesson onSuccess={handleSuccess} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
