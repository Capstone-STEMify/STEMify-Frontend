'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Button } from '@/components/shadcn/button'
import { useCreateGroupMutation } from '@/features/group/api/groupApi'
import { useModal } from '@/providers/ModalProvider'

export interface StudentGroupPayload {
  name: string
  code: string
  studentIds: string[]
}

interface UpsertStudentGroupProps {
  studentIds: string[] // <-- danh sách student để tạo group
}

export function UpsertStudentGroup({ studentIds }: UpsertStudentGroupProps) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [createStudentGroup] = useCreateGroupMutation()
  const { closeModal } = useModal()

  const handleSubmit = () => {
    if (!name.trim() || !code.trim()) return

    createStudentGroup({
      name: name.trim(),
      code: code.trim(),
      studentIds: studentIds
    })

    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Create Student Group</DialogTitle>
        </DialogHeader>

        <div className='mt-2 space-y-4'>
          {/* GROUP NAME */}
          <div className='space-y-1'>
            <Label>Group Name</Label>
            <Input placeholder='Enter group name...' value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* GROUP CODE */}
          <div className='space-y-1'>
            <Label>Group Code</Label>
            <Input placeholder='Enter group code...' value={code} onChange={(e) => setCode(e.target.value)} />
          </div>

          {/* DISPLAY SELECTED STUDENT COUNT */}
          <p className='text-sm text-gray-600'>{studentIds.length} students will be added to this group.</p>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={closeModal}>
            Cancel
          </Button>

          <Button disabled={!name.trim() || !code.trim()} onClick={handleSubmit}>
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
