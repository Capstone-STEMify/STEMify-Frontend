import { Dialog, DialogContent } from '@/components/shadcn/dialog'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import UpsertLesson from '@/features/resource/lesson/components/upsert/UpsertLesson'
import { useModal } from '@/providers/ModalProvider'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React from 'react'

interface UpsertLessonModalProps {
  courseIdModal?: number
  onConfirm?: () => void
}
export default function UpsertLessonModal({ courseIdModal, onConfirm }: UpsertLessonModalProps) {
  const { lessonId } = useParams()
  const { closeModal } = useModal()
  const t = useTranslations('lessonManagement')

  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>
          <h1>{lessonId ? `${t('updateTitle')}` : `${t('createTitle')}`}</h1>
        </DialogTitle>
        <ScrollArea className='h-[550px] w-5xl pr-5'>
          <UpsertLesson courseIdModal={courseIdModal} onSuccess={handleSuccess} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
