'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import { useModal } from '../../../providers/ModalProvider'

interface InformationModalProps {
  message: string
}

export default function InformationModal({ message }: InformationModalProps) {
  const { closeModal } = useModal()

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Information</DialogTitle>
        </DialogHeader>
        <p className='text-muted-foreground text-sm'>{message}</p>
        <DialogFooter className='flex justify-end gap-2 pt-4'>
          <Button variant='outline' onClick={closeModal}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
