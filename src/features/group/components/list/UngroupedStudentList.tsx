'use client'

import { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Avatar, AvatarFallback } from '@/components/shadcn/avatar'
import { OrganizationUser } from '@/features/user/types/user.type'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { getColorByInitial } from '@/utils/index'
import { useModal } from '@/providers/ModalProvider'

interface Props {
  students: OrganizationUser[]
  onCreateGroup: (selectedIds: string[]) => void
  onSearchChange: (text: string) => void
}

export function UngroupedStudentList({ students, onCreateGroup, onSearchChange }: Props) {
  const [selected, setSelected] = useState<string[]>([])
  const [groupName, setGroupName] = useState('')
  const { openModal } = useModal()

  const toggleStudent = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selected.length === students.length) setSelected([])
    else setSelected(students.map((s) => s.organizationUserId))
  }

  const initials = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()

  return (
    <div className='mt-5'>
      {/* HEADER */}
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Students Without Group</h2>

        <Button
          disabled={selected.length === 0}
          onClick={() => openModal('upsertStudentGroup', { studentIds: selected })}
        >
          Create Group ({selected.length})
        </Button>
      </div>
      <div className='mb-4 flex flex-wrap items-center gap-3'>
        {/* SEARCH */}
        <div className='w-full sm:w-100'>
          <Input placeholder='Search student...' onChange={(e) => onSearchChange(e.target.value)} />
        </div>
      </div>
      {/* TABLE */}
      <div className='overflow-hidden rounded-lg border bg-white'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10'>
                <Checkbox checked={selected.length === students.length} onCheckedChange={toggleSelectAll} />
              </TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Grade</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((s) => {
              const firstLetter = initials(s.fullName)[0]
              const bgColor = getColorByInitial(firstLetter)
              return (
                <TableRow key={s.organizationUserId}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(s.organizationUserId)}
                      onCheckedChange={() => toggleStudent(s.organizationUserId)}
                    />
                  </TableCell>

                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8 border'>
                        <AvatarFallback className={`${bgColor} font-bold text-white`}>{firstLetter}</AvatarFallback>
                      </Avatar>

                      <span className='font-medium'>{s.fullName}</span>
                    </div>
                  </TableCell>

                  <TableCell className='text-gray-600'>{s.email}</TableCell>
                  <TableCell>{s.grade ?? '-'}</TableCell>
                </TableRow>
              )
            })}

            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className='py-6 text-center text-gray-500'>
                  No ungrouped students.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
