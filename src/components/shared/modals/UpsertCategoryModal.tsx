import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'

interface ConfirmModalProps {
  id?: number
  onConfirm: () => void
}

export default function UpsertCategoryModal({ id, onConfirm }: ConfirmModalProps) {
  const { closeModal } = useModal()
  const handleConfirm = () => {
    onConfirm()
    closeModal()
  }
  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogTitle>Category</DialogTitle>
      <DialogContent>
        <DialogHeader>{id ? 'Edit' : 'Create'} Category</DialogHeader>
      </DialogContent>
      <DialogFooter className='flex justify-end gap-2 pt-4'>
        <Button variant='outline' onClick={closeModal}>
          Cancel
        </Button>
        <Button variant='destructive' onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
