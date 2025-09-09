import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import UpsertLearningOutcomeForm from './UpsertLearningOutcomeForm'
interface UpsertLearningOutcomeModalProps {
  id?: number
  onConfirm?: () => void
}
export default function UpsertLearningOutcomeModal({ id, onConfirm }: UpsertLearningOutcomeModalProps) {
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

      <DialogContent className='w-full sm:max-w-[425px]'>
        <UpsertLearningOutcomeForm id={id} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
