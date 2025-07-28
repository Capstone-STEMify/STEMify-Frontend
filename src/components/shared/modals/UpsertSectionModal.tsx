'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { useModal } from '../../../providers/ModalProvider'
import CreateSection from '@/features/resource/section/components/UpsertSection'
interface ConfirmModalProps {
  lessonId: number
  sectionId: number
  onConfirm: () => void
}
export default function AddSectionModal({ lessonId, sectionId, onConfirm }: ConfirmModalProps) {
  const { closeModal } = useModal()
  const handleSuccess = () => {
    onConfirm()
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new section</DialogTitle>
        </DialogHeader>
        <CreateSection lessonId={lessonId} sectionId={sectionId} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
