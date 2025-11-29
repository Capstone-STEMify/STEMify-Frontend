import { Dialog, DialogContent } from '@/components/shadcn/dialog'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import UpsertOrganization from '@/features/organization/components/upsert/UpsertOrganization'
import { useModal } from '@/providers/ModalProvider'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useTranslations } from 'next-intl'
import React from 'react'

interface UpsertOrganizationModalProps {
  organizationId?: number
  onConfirm?: () => void
}
export default function UpsertOrganizationModal({ organizationId, onConfirm }: UpsertOrganizationModalProps) {
  const { closeModal } = useModal()
  const t = useTranslations('organization')

  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>{organizationId ? `${t('form.title.update')}` : `${t('form.title.create')}`}</DialogTitle>
        <hr />
        <ScrollArea className='h-[500px] w-4xl pr-5'>
          <UpsertOrganization organizationId={organizationId} onSuccess={handleSuccess} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
