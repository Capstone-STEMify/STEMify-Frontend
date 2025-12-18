'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Button } from '@/components/shadcn/button'
import { useCreateOrganizationGroupMutation } from '@/features/group/api/groupApi'
import { useModal } from '@/providers/ModalProvider'
import { useAppSelector } from '@/hooks/redux-hooks'
import { Grade } from '@/features/classroom/types/classroom.type'
import { useTranslations } from 'next-intl'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'

export interface StudentGroupPayload {
  name: string
  code: string
  studentIds: string[]
}

interface UpsertStudentGroupProps {
  studentIds: string[]
}

export function UpsertStudentGroup({ studentIds }: UpsertStudentGroupProps) {
  const tc = useTranslations('common')
  const to = useTranslations('organization.group')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [grade, setGrade] = useState('')
  const [createStudentGroup] = useCreateOrganizationGroupMutation()
  const { closeModal } = useModal()
  const { selectedOrganizationId } = useAppSelector((state) => state.selectedOrganization)
  const { user } = useAppSelector((state) => state.auth)

  const handleSubmit = () => {
    if (!name.trim() || !code.trim() || !grade.trim() || !selectedOrganizationId || !user?.userId) return

    createStudentGroup({
      organizationId: selectedOrganizationId!,
      groupData: {
        name: name.trim(),
        code: code.trim(),
        grade: Number(grade),
        createdByUserId: user?.userId,
        studentIds: studentIds
      }
    })

    closeModal()
  }

  const GRADE_OPTIONS = Object.values(Grade)
    .filter((v) => typeof v === 'number')
    .map((grade) => ({
      label: `${tc('grade')} ${grade}`,
      value: grade.toString()
    }))

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{to('createStudentGroup')}</DialogTitle>
        </DialogHeader>

        <div className='mt-2 space-y-4'>
          {/* GROUP NAME */}
          <div className='space-y-1'>
            <Label>{to('groupName')}</Label>
            <Input placeholder={to('enterGroupName')} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {/* GROUP CODE */}
          <div className='space-y-1'>
            <Label>{to('groupCode')}</Label>
            <Input placeholder={to('enterGroupCode')} value={code} onChange={(e) => setCode(e.target.value)} required />
          </div>

          <div className='space-y-1'>
            <Label htmlFor='grade'>{tc('grade')}</Label>
            <Select value={grade} onValueChange={setGrade} required>
              <SelectTrigger className='w-32'>
                <SelectValue placeholder={tc('grade')} />
              </SelectTrigger>
              <SelectContent>
                {GRADE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DISPLAY SELECTED STUDENT COUNT */}
          <p className='text-sm text-gray-600'>
            {studentIds.length} {to('studentsWillBeAdded')}
          </p>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={closeModal}>
            {tc('button.cancel')}
          </Button>

          <Button disabled={!name.trim() || !code.trim()} onClick={handleSubmit}>
            {tc('button.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
