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
  const tClassroom = useTranslations('classroom')

  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }

  const renderTitle = () => {
    switch (mode) {
      case 'basic':
        return <>{tClassroom('update.basicInfo')}</>
      case 'curriculum':
        return <>{tClassroom('update.curriculum')}</>
      case 'teacher':
        return <>{tClassroom('update.teacher')}</>
      case 'students':
        return <>{tClassroom('update.students')}</>
      default:
        return ''
    }
  }

  const renderContent = () => {
    switch (mode) {
      case 'basic':
        return (
          <div className='w-4xl'>
            <UpdateClassroomOrganizationBasicInfo classroomId={classroomId} onSuccess={handleSuccess} />
          </div>
        )
      case 'curriculum':
        return (
          <div className='w-2xl'>
            <UpdateClassroomCurriculum classroomId={classroomId} onSuccess={handleSuccess} />
          </div>
        )

      case 'teacher':
        return (
          <div className='w-2xl'>
            <UpdateClassroomTeacher classroomId={classroomId} onSuccess={handleSuccess} />
          </div>
        )
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
