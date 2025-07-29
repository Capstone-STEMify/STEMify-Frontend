import { Dialog, DialogContent } from '@/components/shadcn/dialog'
import UpsertLesson from '@/features/resource/lesson/components/UpsertLesson'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'

interface UpsertLessonModalProps {
  courseIdModal?: number
}
export default function UpsertLessonModal({ courseIdModal }: UpsertLessonModalProps) {
  const { closeModal } = useModal()

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <UpsertLesson courseIdModal={courseIdModal} />
      </DialogContent>
    </Dialog>
  )
}
