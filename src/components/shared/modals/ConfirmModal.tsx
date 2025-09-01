'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import { useModal } from '../../../providers/ModalProvider'
import { useTranslations } from 'next-intl'

interface ConfirmModalProps {
  message: string
  onConfirm: () => void
}

export default function ConfirmModal({ message, onConfirm }: ConfirmModalProps) {
  const tb = useTranslations('button')
  const tc = useTranslations('common')
  const { closeModal } = useModal()

  const handleConfirm = () => {
    onConfirm()
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tc('confirmationLabel')}</DialogTitle>
        </DialogHeader>
        <p className='text-muted-foreground text-sm'>{message}</p>
        <DialogFooter className='flex justify-end gap-2 pt-4'>
          <Button variant='outline' onClick={closeModal}>
            {tb('cancel')}
          </Button>
          <Button variant='destructive' onClick={handleConfirm}>
            {tb('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
