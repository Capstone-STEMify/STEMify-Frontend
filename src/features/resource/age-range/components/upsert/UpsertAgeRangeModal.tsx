'use client'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import UpsertAgeRange from '@/features/resource/age-range/components/upsert/UpsertAgeRange'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

interface UpsertAgeRangeModalProps {
  id?: number
  onConfirm?: () => void
}

export default function UpsertAgeRangeModal({ id, onConfirm }: UpsertAgeRangeModalProps) {
  const { closeModal } = useModal()
  const t = useTranslations('Admin.ageRange')

  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='w-[95%] rounded-xl p-4 sm:max-w-md sm:p-6 md:max-w-lg lg:max-w-xl'>
        <DialogTitle>
          <p>{id ? `${t('editTitle')}` : `${t('createTitle')}`}</p>
        </DialogTitle>
        <hr />

        <UpsertAgeRange id={id} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
