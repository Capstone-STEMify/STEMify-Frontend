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
        return t('updateClassroom.basicInfoTitle')
      case 'curriculum':
        return t('updateClassroom.curriculumTitle')
      case 'teacher':
        return t('updateClassroom.teacherTitle')
      case 'students':
        return t('updateClassroom.studentsTitle')
      default:
        return ''
    }
  }

  const renderContent = () => {
    switch (mode) {
      case 'basic':
        return (
          <ScrollArea className='h-[500px] w-4xl'>
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
