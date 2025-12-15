import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useAddStudentToGroupMutation } from '@/features/group/api/groupApi'
import StudentColumn from '@/features/group/components/upsert/StudentColumn'
import { useGetOrganizationUserQuery } from '@/features/user/api/userApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { LicenseType } from '@/types/userRole'
import { useParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function AddStudentToGroupModal() {
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
  const { selectedOrganizationId } = useAppSelector((state) => state.selectedOrganization)

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

  const [addStudents] = useAddStudentToGroupMutation()

  const handleAddStudents = () => {
    addStudents({ groupId: Number(groupId), studentIds: selectedStudentIds })
    toast.success('Đã thêm học sinh vào nhóm thành công')
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>Thêm Học Sinh Vào Nhóm</DialogTitle>
        <div className='w-xl'>
          <DataTable
            data={rows}
            columns={columns as any}
            enableRowSelection
            // pagingData={1}
            // pagingParams={1}
            handlePageChange={() => {}}
            onSelectionChange={(ids) => setSelectedStudentIds(ids.map(String))}
          />

          <div className='flex justify-end'>
            <button
              onClick={handleAddStudents}
              className='rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600'
            >
              Thêm
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
