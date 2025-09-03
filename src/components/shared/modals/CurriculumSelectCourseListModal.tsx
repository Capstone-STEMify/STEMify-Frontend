import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { useAppDispatch } from '@/hooks/redux-hooks'

import AdminCurriculumSelectCourseList from '@/features/resource/curriculum/components/list/AdminCurriculumSelectCourseList'

interface CourseListModalProps {
  curriculumId?: number
  onConfirm?: () => void
}

export default function CurriculumSelectCourseListModal({ curriculumId, onConfirm }: CourseListModalProps) {
  const { closeModal } = useModal()
  const dispatch = useAppDispatch()

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='h-fit w-full max-w-4xl'>
        <DialogTitle>Select Courses</DialogTitle>

        <AdminCurriculumSelectCourseList />
      </DialogContent>
    </Dialog>
  )
}
