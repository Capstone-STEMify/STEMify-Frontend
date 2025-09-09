'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { useModal } from '../../../providers/ModalProvider'
import CreateSection from '@/features/resource/section/components/UpsertSection'
import { Button } from '@/components/shadcn/button'
interface ConfirmModalProps {
  lessonId: number
  sectionId: number
  onConfirm: () => void
}
export default function AddSectionModal({ lessonId, sectionId, onConfirm }: ConfirmModalProps) {
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
        <DialogHeader></DialogHeader>
        <CreateSection lessonId={lessonId} sectionId={sectionId} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
