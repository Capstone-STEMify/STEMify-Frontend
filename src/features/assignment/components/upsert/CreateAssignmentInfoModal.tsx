import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import CreateAssignmentInfo from '@/features/assignment/components/upsert/CreateAssignmentInfo'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

type CreateAssignmentInfoModalProps = {
  sectionId: number
}

export default function CreateAssignmentInfoModal({ sectionId }: CreateAssignmentInfoModalProps) {
  const ta = useTranslations('assignment')
  const { closeModal } = useModal()

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>{ta('upsert.create')}</DialogTitle>
        <CreateAssignmentInfo sectionId={sectionId} closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  )
}
