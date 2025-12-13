import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useAddStudentToGroupMutation } from '@/features/group/api/groupApi'
import StudentColumn from '@/features/group/components/upsert/StudentColumn'
import { useModal } from '@/providers/ModalProvider'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

type Student = {
  id: string
  name: string
  email: string
  avatar: string
}

// id is guid type
const MOCK_STUDENTS: Student[] = [
  { id: 'b3b4f7e2-5f92-4c44-9c8a-42f7c15af101', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', avatar: '' },
  { id: 'e8c1cb2a-0c3b-4db2-9fa7-cb0abf9ad3c2', name: 'Trần Thị B', email: 'tranthib@example.com', avatar: '' },
  { id: '9f37d6d8-0b15-4a19-9e6f-4d40f1a8f93f', name: 'Lê Văn C', email: 'levanc@example.com', avatar: '' },
  { id: 'c5a3ef0e-7de1-442c-b7c7-9f0e239aeba4', name: 'Phạm Thị D', email: 'phamthid@example.com', avatar: '' },
  { id: 'f4c9829e-0f3e-41f9-9c53-6d3b2897b51a', name: 'Hoàng Văn E', email: 'hoangvane@example.com', avatar: '' },
  { id: 'd1bffec6-0bc0-4d22-b5b7-fac2e57c3b0a', name: 'Vũ Thị F', email: 'vuthif@example.com', avatar: '' },
  { id: 'a8b72631-6c46-4f67-8c73-0c9e3e35a9fd', name: 'Đặng Văn G', email: 'dangvang@example.com', avatar: '' },
  { id: '7c3e0a4d-2e0c-4e66-9e12-712a1c4f2eb4', name: 'Bùi Thị H', email: 'buithih@example.com', avatar: '' },
  { id: 'fddc6f8e-0d4c-4777-8dbb-0f1e3af1a21e', name: 'Đỗ Văn I', email: 'dovani@example.com', avatar: '' },
  { id: '4d96b7e2-5a28-42b2-a28a-8fd1a0c3f6df', name: 'Ngô Thị K', email: 'ngothik@example.com', avatar: '' }
]

export default function AddStudentToGroupModal() {
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])

  const { closeModal } = useModal()
  const { groupId } = useParams()
  const columns = StudentColumn()

  const [addStudents] = useAddStudentToGroupMutation()

  const handleAddStudents = () => {
    addStudents({ groupId: Number(groupId), studentIds: selectedStudentIds })
    // closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>AddStudentToGroupModal</DialogTitle>
        <div className='w-xl'>
          <DataTable
            data={MOCK_STUDENTS}
            columns={columns}
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
              Add Selected Students
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
