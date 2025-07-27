'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import { useModal } from '../../../providers/ModalProvider'
import { useCreateSectionMutation } from '@/features/resource/section/api/sectionApi'
import CreateSection from '@/features/resource/section/components/CreateSection'
interface ConfirmModalProps {
  lessonId: number
  message: string
  onConfirm: () => void
}
export default function AddSectionModal({ lessonId, message, onConfirm }: ConfirmModalProps) {
  const { closeModal } = useModal()

  const handleConfirm = () => {
    onConfirm()
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new section</DialogTitle>
        </DialogHeader>
        <CreateSection />
      </DialogContent>
    </Dialog>
  )
}
