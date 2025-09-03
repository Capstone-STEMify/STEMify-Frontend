import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { useSearchCourseQuery } from '../../../features/resource/course/api/courseApi'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { setPageIndex } from '../../../features/resource/course/slice/courseSlice'
import { useGetCourseAction } from '../../../features/resource/course/components/list/CourseAction'

import { ScrollArea } from '@/components/shadcn/scroll-area'
import AdminCourseList from '@/features/resource/course/components/list/AdminCourseList'
import AdminCurriculumSelectCourseList from '@/features/resource/curriculum/components/list/AdminCurriculumSelectCourseList'

interface CourseListModalProps {
  curriculumId?: number
  onConfirm?: () => void
}

export default function CurriculumSelectCourseListModal({ curriculumId, onConfirm }: CourseListModalProps) {
  const { closeModal } = useModal()
  const dispatch = useAppDispatch()

  const { data: courseData } = useSearchCourseQuery({ curriculumId })
  const columns = useGetCourseAction()

  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }
  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }
  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='h-fit w-full max-w-7xl'>
        <DialogTitle>Select Courses</DialogTitle>

        <div>
          <AdminCurriculumSelectCourseList />
        </div>
      </DialogContent>
    </Dialog>
  )
}
