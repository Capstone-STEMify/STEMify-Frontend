'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import { useModal } from '../../../providers/ModalProvider'

interface ConfirmModalProps {
  message: string
  onConfirm: () => void
}

export default function ConfirmModal({ message, onConfirm }: ConfirmModalProps) {
  const { closeModal } = useModal()

  const handleConfirm = () => {
    onConfirm()
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <p className='text-muted-foreground text-sm'>{message}</p>
        <DialogFooter className='flex justify-end gap-2 pt-4'>
          <Button variant='outline' onClick={closeModal}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
