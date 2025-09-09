import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import UpsertCategory from '@/features/resource/category/components/management/UpsertCategory'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'

interface UpsertCategoryModalProps {
  id?: number
  onConfirm?: () => void
}

export default function UpsertCategoryModal({ id, onConfirm }: UpsertCategoryModalProps) {
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
        {/* Render the form component and pass props */}
        <UpsertCategory id={id} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
