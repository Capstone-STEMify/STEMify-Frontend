import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { useTranslations } from 'next-intl'
import SelectComponentList from '@/features/kit-components/components/list/SelectComponentList'
import { KitComponent } from '@/features/kit-components/types/kit-component.type'

interface SelectComponentListModalProps {
  kitId: number
  onConfirm?: () => void
  existedComponents?: KitComponent[]
  refetch?: () => void
}

export default function SelectComponentListModal({
  kitId,
  onConfirm,
  existedComponents,
  refetch
}: SelectComponentListModalProps) {
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

        <SelectComponentList kitId={kitId} onSuccess={handleSuccess} refetch={refetch} existedComponents={existedComponents} />
      </DialogContent>
    </Dialog>
  )
}
