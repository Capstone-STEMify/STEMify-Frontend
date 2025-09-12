import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { useTranslations } from 'next-intl'
import KitListTable from '@/features/resource/kit/components/list/KitListTable'

interface CourseListModalProps {
  onConfirm?: () => void
  kitIds?: number[]
}

export default function KitListTableModal({ onConfirm, kitIds }: CourseListModalProps) {
  const t = useTranslations('curriculum')
  const { closeModal } = useModal()

  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='h-fit w-full max-w-3xl'>
        <DialogTitle>{t('custom.selectKitTitle')}</DialogTitle>
        <KitListTable onSuccess={handleSuccess} kitIds={kitIds} />
      </DialogContent>
    </Dialog>
  )
}
