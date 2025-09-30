'use client'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import UpsertStandard from '@/features/resource/standard/components/upsert/UpsertStandard'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

interface UpsertStandardModalProps {
  id?: number
  onConfirm?: () => void
}

export default function UpsertStandardModal({ id, onConfirm }: UpsertStandardModalProps) {
  const { closeModal } = useModal()
  const t = useTranslations('Admin.standard')

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
        <UpsertStandard id={id} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
