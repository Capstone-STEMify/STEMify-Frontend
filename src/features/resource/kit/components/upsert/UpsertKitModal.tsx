import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { useTranslations } from 'next-intl'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import UpsertKit from '@/features/resource/kit/components/upsert/UpsertKit'
interface UpsertKitModalProps {
  kitId?: number
  onConfirm: () => void
}
export default function UpsertKitModal({ kitId, onConfirm }: UpsertKitModalProps) {
  const tc = useTranslations('common')
  const t = useTranslations('kits')
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
        <ScrollArea className='h-[500px]'>
          <UpsertKit kitId={kitId} onSuccess={handleSuccess} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
