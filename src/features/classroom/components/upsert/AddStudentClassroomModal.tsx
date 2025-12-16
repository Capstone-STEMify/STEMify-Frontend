import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useAddClassroomStudentsMutation } from '@/features/classroom/api/classroomApi'
import { useAddStudentToGroupMutation } from '@/features/group/api/groupApi'
import StudentColumn from '@/features/group/components/upsert/StudentColumn'
import { useGetOrganizationUserQuery } from '@/features/user/api/userApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { LicenseType } from '@/types/userRole'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function AddStudentClassroomModal() {
  const tClassroom = useTranslations('classroom')
  const tc = useTranslations('common')

  const { classroomId } = useParams()

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
  const { selectedOrganizationId } = useAppSelector((state) => state.selectedOrganization)
  const [pageNumber, setPageNumber] = useState(1)

  const { closeModal } = useModal()
  const { groupId } = useParams()
  const columns = StudentColumn()
  const { data: ungroupedStudents } = useGetOrganizationUserQuery(
    { organizationId: selectedOrganizationId!, pageNumber: 1, pageSize: 50, role: LicenseType.STUDENT },
    { skip: !selectedOrganizationId }
  )
  const rows = useMemo(
    () => ungroupedStudents?.data.items.map((student) => ({ ...student, id: student.organizationUserId })) ?? [],
    [ungroupedStudents]
  )

  const [addStudents] = useAddClassroomStudentsMutation()

  const handleAddStudents = () => {
    addStudents({ classroomId: Number(classroomId), studentIds: selectedStudentIds })
    toast.success('Đã thêm học sinh vào lớp học thành công')
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>{tClassroom('addStudentsToClassroom')}</DialogTitle>
        <div className='w-xl'>
          <DataTable
            data={rows}
            columns={columns as any}
            enableRowSelection
            pagingData={ungroupedStudents}
            pagingParams={pageNumber}
            handlePageChange={(page) => setPageNumber(page)}
            onSelectionChange={(ids) => setSelectedStudentIds(ids.map(String))}
          />

          <div className='flex justify-end'>
            <Button onClick={handleAddStudents}>{tc('button.add')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
