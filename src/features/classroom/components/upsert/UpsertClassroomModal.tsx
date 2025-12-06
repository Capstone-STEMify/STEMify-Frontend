import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import UpsertClassroom from '@/features/classroom/components/upsert/CreateClassroom'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

interface UpsertClassroomModalProps {
  classroomId?: number
  onConfirm?: () => void
}
export default function UpsertClassroomModal({ classroomId, onConfirm }: UpsertClassroomModalProps) {
  const { closeModal } = useModal()
  const t = useTranslations('curriculum')

  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>{classroomId ? `${t('form.title.update')}` : `${t('form.title.create')}`}</DialogTitle>
        <hr />
        <ScrollArea className='h-[500px] w-4xl'>
          {/* <UpsertClassroom classroomId={classroomId} onSuccess={handleSuccess} /> */}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
