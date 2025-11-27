import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function ImportQuizModal() {
  const tq = useTranslations('quiz')
  const { closeModal } = useModal()
  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>{tq('import.title')}</DialogTitle>
        <div></div>
      </DialogContent>
    </Dialog>
  )
}
