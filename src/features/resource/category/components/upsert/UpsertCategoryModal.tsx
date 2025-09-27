import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import UpsertCategory from '@/features/resource/category/components/upsert/UpsertCategory'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

interface UpsertCategoryModalProps {
  id?: number
  onConfirm?: () => void
}

export default function UpsertCategoryModal({ id, onConfirm }: UpsertCategoryModalProps) {
  const { closeModal } = useModal()
  const t = useTranslations('Admin.topic')

  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='lg:max-w-ls w-[95%] rounded-xl p-4 sm:max-w-md sm:p-6 md:max-w-lg'>
        <DialogTitle>
          <p>{id ? `${t('editTitle')}` : `${t('createTitle')}`}</p>
        </DialogTitle>
        <hr />

        <UpsertCategory id={id} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
