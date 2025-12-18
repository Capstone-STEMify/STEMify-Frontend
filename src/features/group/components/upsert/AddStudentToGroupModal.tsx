import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { DataTable } from '@/components/shared/data-table/data-table'
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

export default function AddStudentToGroupModal() {
  const to = useTranslations('organization.group')
  const tc = useTranslations('common')

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
  const { selectedOrganizationId } = useAppSelector((state) => state.selectedOrganization)
  const [pageNumber, setPageNumber] = useState(1)

  const { closeModal } = useModal()
  const { groupId } = useParams()
  const columns = StudentColumn()
  // Fetch students who are not in any group
  const { data } = useGetOrganizationUserQuery(
    { organizationId: selectedOrganizationId!, pageNumber: 1, pageSize: 20, groupId: 0, role: LicenseType.STUDENT },
    { skip: !selectedOrganizationId }
  )
  const rows = useMemo(
    () => data?.data.items.map((student) => ({ ...student, id: student.organizationUserId })) ?? [],
    [data]
  )

  const [addStudents] = useAddStudentToGroupMutation()

  const handleAddStudents = () => {
    addStudents({ groupId: Number(groupId), studentIds: selectedStudentIds })
    closeModal()
  }

  const handlePageChange = (page: number) => {
    setPageNumber(page)
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='max-h-[80vh] overflow-y-auto'>
        <DialogTitle>{to('addStudentsToGroup')}</DialogTitle>
        <div className='w-3xl'>
          <DataTable
            data={rows}
            columns={columns as any}
            enableRowSelection
            pagingData={data}
            pagingParams={{ pageNumber, pageSize: 20 }}
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
