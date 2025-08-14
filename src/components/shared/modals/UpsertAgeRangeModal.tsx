'use client'
import { Dialog, DialogContent } from '@/components/shadcn/dialog'
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
      <DialogContent className='sm:max-w-lg w-full'>
        <UpsertAgeRange id={id} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}