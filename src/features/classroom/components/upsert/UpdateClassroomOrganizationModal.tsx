import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import UpdateClassroomCurriculum from '@/features/classroom/components/upsert/UpdateClassroomCurriculum'
import UpdateClassroomOrganizationBasicInfo from '@/features/classroom/components/upsert/UpdateClassroomOrganizationBasicInfo'
import UpdateClassroomTeacher from '@/features/classroom/components/upsert/UpdateClassroomTeacher'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

type UpdateClassroomOrganizationModalProps = {
  classroomId: number
  onConfirm?: () => void
  mode: 'basic' | 'curriculum' | 'teacher' | 'students'
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

  const renderTitle = () => {
    switch (mode) {
      case 'basic':
        return <h1>Update Classroom Organization Basic Information</h1>
      case 'curriculum':
        return <h1>Update Classroom Curriculum</h1>
      case 'teacher':
        return <h1>Update Classroom Teacher</h1>
      case 'students':
        return <h1>Remove Classroom Students</h1>
      default:
        return ''
    }
  }

  const renderContent = () => {
    switch (mode) {
      case 'basic':
        return (
          <ScrollArea className='w-4xl'>
            <UpdateClassroomOrganizationBasicInfo classroomId={classroomId} onSuccess={handleSuccess} />
          </ScrollArea>
        )
      case 'curriculum':
        return <UpdateClassroomCurriculum classroomId={classroomId} onSuccess={handleSuccess} />
      case 'teacher':
        return <UpdateClassroomTeacher classroomId={classroomId} onSuccess={handleSuccess} />
      case 'students':
      default:
        return null
    }
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>{renderTitle()}</DialogTitle>
        {renderContent()}
      </DialogContent>
    </Dialog>
  )
}
