'use client'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import UpsertStandard from '@/features/resource/standard/components/management/UpsertStandard'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'

interface UpsertStandardModalProps {
  id?: number
  onConfirm?: () => void
}

export default function UpsertStandardModal({ id, onConfirm }: UpsertStandardModalProps) {
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
        <UpsertStandard id={id} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
