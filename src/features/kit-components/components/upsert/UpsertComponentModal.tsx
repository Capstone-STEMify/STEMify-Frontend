import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { useTranslations } from 'next-intl'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import UpsertKit from '@/features/resource/kit/components/upsert/UpsertKit'
import UpsertComponent from '@/features/kit-components/components/upsert/UpsertComponent'

interface UpsertComponentModalProps {
  componentId?: number
  onConfirm: () => void
}
export default function UpsertComponentModal({ componentId, onConfirm }: UpsertComponentModalProps) {
  const tc = useTranslations('common')
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
      <DialogContent className='flex w-full max-w-[660px] flex-col lg:w-[660px]'>
        <DialogHeader className='shrink-0'>
          <DialogTitle>{t('form.title.create')}</DialogTitle>
        </DialogHeader>
        <hr />
        <div>
          <UpsertComponent componentId={componentId} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
