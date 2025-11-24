import { Dialog, DialogContent } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import LessonDetail from './LessonDetail'
import { DialogTitle } from '@radix-ui/react-dialog'

export default function LessonDetailModal({ lessonId }: { lessonId: number }) {
  const { closeModal } = useModal()
  return (
    <div>
      <Dialog open onOpenChange={closeModal}>
        <DialogTitle></DialogTitle>
        <DialogContent className='max-h-[90vh] w-full max-w-7xl overflow-auto'>
          <LessonDetail />
        </DialogContent>
      </Dialog>
    </div>
  )
}
