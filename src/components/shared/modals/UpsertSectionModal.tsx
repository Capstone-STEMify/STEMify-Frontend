'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '../../../providers/ModalProvider'
import CreateSection from '@/features/resource/section/components/upsert/UpsertSection'
interface ConfirmModalProps {
  lessonId: number
  sectionId: number
  onConfirm: () => void
}
export default function UpsertSectionModal({ lessonId, sectionId, onConfirm }: ConfirmModalProps) {
  const { closeModal } = useModal()
  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <CreateSection lessonId={lessonId} sectionId={sectionId} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
