import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { useTranslations } from 'next-intl'
import CurriculumSelectEmulatorList from '@/features/resource/curriculum/components/modal/AdminCurriculumSelectEmulatorList'

interface CurriculumSelectEmulatorListModalProps {
  curriculumId: number
  onConfirm?: () => void
  emulatorIds?: string[]
}

export default function CurriculumSelectEmulatorListModal({
  curriculumId,
  onConfirm,
  emulatorIds
}: CurriculumSelectEmulatorListModalProps) {
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
      <DialogContent className='h-fit w-full max-w-4xl'>
        <DialogTitle>{t('custom.emulatorListTitle')}</DialogTitle>

        <CurriculumSelectEmulatorList curriculumId={curriculumId} onSuccess={handleSuccess} emulatorIds={emulatorIds} />
      </DialogContent>
    </Dialog>
  )
}
