import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import UpdateClassroomOrganization from '@/features/classroom/components/upsert/UpdateClassroomOrganization'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

type UpdateClassroomOrganizationModalProps = {
  classroomId: number
  onConfirm?: () => void
  mode: 'updateBasic' | 'updateCurriculum' | 'updateTeacher' | 'removeStudents'
}

export default function UpdateClassroomOrganizationModal({
  classroomId,
  onConfirm,
  mode
}: UpdateClassroomOrganizationModalProps) {
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
        <DialogTitle></DialogTitle>
        <ScrollArea className='h-[500px] w-4xl'>
          <UpdateClassroomOrganization classroomId={classroomId} onSuccess={handleSuccess} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
