import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { useSearchCourseQuery } from '../../../features/resource/course/api/courseApi'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { setPageIndex } from '../../../features/resource/course/slice/courseSlice'
import { useGetCourseAction } from '../../../features/resource/course/components/list/CourseAction'
import CardLayout from '@/components/shared/card/CardLayout'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Badge } from '@/components/shadcn/badge'
import { getCourseStatusBadgeClass, getLevelBadgeClass } from '@/utils/badgeColor'
import { capitalizeFirst } from '@/utils/index'
import CourseManagement from '@/features/resource/course/components/list/CourseManagement'

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

        <ScrollArea className='h-[550px]'>
          <CourseManagement />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
