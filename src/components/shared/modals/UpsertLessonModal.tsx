import { Dialog, DialogContent } from '@/components/shadcn/dialog'
import UpsertLesson from '@/features/resource/lesson/components/UpsertLesson'
import { useModal } from '@/providers/ModalProvider'
import { DialogTitle } from '@radix-ui/react-dialog'
import React from 'react'

interface UpsertLessonModalProps {
  courseIdModal?: number
  onConfirm?: () => void
}
export default function UpsertLessonModal({ courseIdModal, onConfirm }: UpsertLessonModalProps) {
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
      <DialogContent>
        <UpsertLesson courseIdModal={courseIdModal} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
