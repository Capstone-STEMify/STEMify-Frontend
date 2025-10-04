import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { useTranslations } from 'next-intl'
import SelectComponentList from '@/features/kit-components/components/list/SelectComponentList'

interface SelectComponentListModalProps {
  kitId: number
  onConfirm?: () => void
  componentIds?: number[]
}

export default function SelectComponentListModal({ kitId, onConfirm, componentIds }: SelectComponentListModalProps) {
  const t = useTranslations('components')
  const { closeModal } = useModal()

  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='h-fit w-full max-w-4xl'>
        <DialogTitle>{t('custom.selectComponentTitle')}</DialogTitle>

        <SelectComponentList kitId={kitId} onSuccess={handleSuccess} componentIds={componentIds} />
      </DialogContent>
    </Dialog>
  )
}
