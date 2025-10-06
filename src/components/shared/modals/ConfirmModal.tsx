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
  const tc = useTranslations('common')
  const tm = useTranslations('toast.confirmMessage')
  const { closeModal } = useModal()

  const handleConfirm = () => {
    closeModal()
    onConfirm()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tm('confirmLabel')}</DialogTitle>
        </DialogHeader>
        <p className='text-muted-foreground text-sm'>{message}</p>
        <DialogFooter className='flex justify-end gap-2 pt-4'>
          <Button variant='outline' onClick={closeModal}>
            {tc('button.cancel')}
          </Button>
          <Button variant='destructive' onClick={handleConfirm}>
            {tc('button.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
