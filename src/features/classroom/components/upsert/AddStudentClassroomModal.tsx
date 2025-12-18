import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useAddClassroomStudentsMutation } from '@/features/classroom/api/classroomApi'
import StudentColumn from '@/features/group/components/upsert/StudentColumn'
import { useGetOrganizationUserQuery } from '@/features/user/api/userApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { LicenseType } from '@/types/userRole'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'

type AddStudentClassroomModalProps = {
  classroomStudentIds?: string[]
}
export default function AddStudentClassroomModal({ classroomStudentIds }: AddStudentClassroomModalProps) {
  const tClassroom = useTranslations('classroom')
  const tc = useTranslations('common')

  const { classroomId } = useParams()

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
  const { selectedOrganizationId } = useAppSelector((state) => state.selectedOrganization)
  const [pageNumber, setPageNumber] = useState(1)

  const { closeModal } = useModal()
  const { groupId } = useParams()
  const columns = StudentColumn()
  const { data: students } = useGetOrganizationUserQuery(
    { organizationId: selectedOrganizationId!, pageNumber, pageSize: 50, role: LicenseType.STUDENT },
    { skip: !selectedOrganizationId }
  )
  const filteredStudents = useMemo(() => {
    if (!students) return students
    if (!classroomStudentIds || classroomStudentIds.length === 0) return students

    const filteredItems = students.data.items.filter(
      (student) => !classroomStudentIds.includes(student.organizationUserId)
    )
    return {
      ...students,
      data: {
        ...students.data,
        items: filteredItems
      }
    }
  }, [students, classroomStudentIds])
  const rows = useMemo(
    () => filteredStudents?.data.items.map((student) => ({ ...student, id: student.organizationUserId })) ?? [],
    [filteredStudents]
  )

  const [addStudents] = useAddClassroomStudentsMutation()

  const handleAddStudents = () => {
    addStudents({ classroomId: Number(classroomId), studentIds: selectedStudentIds })
    toast.success('Đã thêm học sinh vào lớp học thành công')
    closeModal()
  }

  const handlePageChange = (page: number) => {
    setPageNumber(page)
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='max-h-[80vh] overflow-y-auto'>
        <DialogTitle>{tClassroom('addStudentsToClassroom')}</DialogTitle>
        <div className='w-xl'>
          <DataTable
            data={rows}
            columns={columns as any}
            enableRowSelection
            pagingData={students}
            pagingParams={{ pageNumber, pageSize: 50 }}
            handlePageChange={(p) => handlePageChange(p)}
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
