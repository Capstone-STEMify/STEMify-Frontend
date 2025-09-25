import { Dialog, DialogContent } from '@/components/shadcn/dialog'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import UpsertCourse from '@/features/resource/course/components/upsert/UpsertCourse'
import { useModal } from '@/providers/ModalProvider'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useTranslations } from 'next-intl'
import React from 'react'

interface UpsertCourseModalProps {
  courseId?: number
  onConfirm?: () => void
}
export default function UpsertCourseModal({ courseId, onConfirm }: UpsertCourseModalProps) {
  const { closeModal } = useModal()
  const t = useTranslations('course')

  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>{courseId ? `${t('form.title.update')}` : `${t('form.title.create')}`}</DialogTitle>
        <hr />
        <ScrollArea className='h-[500px] w-4xl pr-5'>
          <UpsertCourse courseId={courseId} onSuccess={handleSuccess} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
