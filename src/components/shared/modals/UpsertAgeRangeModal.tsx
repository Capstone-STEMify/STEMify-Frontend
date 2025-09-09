'use client'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import UpsertAgeRange from '@/features/resource/age-range/components/management/UpsertAgeRange'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'

interface UpsertAgeRangeModalProps {
  id?: number
  onConfirm?: () => void
}

export default function UpsertAgeRangeModal({ id, onConfirm }: UpsertAgeRangeModalProps) {
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

      <DialogContent className='w-full sm:max-w-lg'>
        <UpsertAgeRange id={id} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
