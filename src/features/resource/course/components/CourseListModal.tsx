import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { useSearchCourseQuery } from '../api/courseApi'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { setPageIndex } from '../slice/courseSlice'
import { useGetCourseAction } from './table/CourseAction'

interface CourseListModalProps {
  id?: number
  onConfirm?: () => void
}

export default function CourseListModal({ id, onConfirm }: CourseListModalProps) {
  const { closeModal } = useModal()
  const dispatch = useAppDispatch()

  const { data: courseData } = useSearchCourseQuery({ curriculumId: id })
  const rows = React.useMemo(() => courseData?.data.items ?? [], [courseData])
  const columns = useGetCourseAction()
  const visibleKeys = ['code', 'title', 'imageUrl']
  const filteredColumns = columns.filter((col) =>
    'accessorKey' in col ? visibleKeys.includes(col.accessorKey as string) : visibleKeys.includes(col.id ?? '')
  )

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
      <DialogTitle></DialogTitle>

      <DialogContent className='w-full max-w-7xl'>
        <DataTable
          data={rows}
          columns={filteredColumns}
          enableRowSelection
          pagingData={courseData?.data}
          pagingParams={{}}
          handlePageChange={handlePageChange}
        />
      </DialogContent>
    </Dialog>
  )
}
