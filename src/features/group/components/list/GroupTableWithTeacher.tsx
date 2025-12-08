import React, { useEffect, useState } from 'react'
import { SingleSelectWithSearch } from '@/components/shared/SingleSelectWithSearch'
import { useSearchGroupByOrganizationIdQuery } from '@/features/group/api/groupApi'
import { LicenseAssignmentType } from '@/features/license-assignment/types/licenseAssignment'
import { useGetOrganizationUserQuery, useSearchUserV2Query } from '@/features/user/api/userApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { getOptions, getOptionsV2 } from '@/utils/index'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Group } from '@/features/group/types/group.type'
import { useTranslations } from 'next-intl'
import { LicenseType } from '@/types/userRole'
import { Users2 } from 'lucide-react'

type GroupTableWithTeacherProps = {
  grade: string
  onGroupsChange: (
    groups: {
      groupCode: string
      groupName: string
      teacherId: string
      studentIds: string[]
    }[]
  ) => void
}

export default function GroupTableWithTeacher({ grade, onGroupsChange }: GroupTableWithTeacherProps) {
  const tc = useTranslations('common')
  const to = useTranslations('organization')

  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [teacherAssignments, setTeacherAssignments] = useState<Record<number, string>>({})

  const { selectedOrganizationId } = useAppSelector((state) => state.selectedOrganization)

  const { data } = useSearchGroupByOrganizationIdQuery(
    { organizationId: selectedOrganizationId!, params: { grade: Number(grade) } },
    { skip: !selectedOrganizationId }
  )

  const { data: organizationUserData } = useGetOrganizationUserQuery(
    { organizationId: selectedOrganizationId!, role: LicenseType.TEACHER },
    { skip: !selectedOrganizationId }
  )

  const teacherOptions = getOptionsV2(
    organizationUserData?.data.items,
    'userName',
    'organizationUserId',
    'imageUrl',
    'email'
  )
  const groups = data?.data.items || []

  const emitSelectedGroups = () => {
    if (!onGroupsChange) return

    const selected = selectedRows.map((groupId) => {
      const group = groups.find((g) => g.id === groupId)!
      return {
        groupCode: group.code,
        groupName: group.name,
        teacherId: teacherAssignments[groupId],
        studentIds: group.students.map((s) => s.organizationUserId)
      }
    })

    onGroupsChange(selected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = groups.map((group: Group) => group.id)
      setSelectedRows(allIds)
      console.log('Selected all rows:', allIds)
    } else {
      setSelectedRows([])
      console.log('Deselected all rows')
    }
  }

  const handleSelectRow = (groupId: number, checked: boolean) => {
    const newSelectedRows = checked ? [...selectedRows, groupId] : selectedRows.filter((id) => id !== groupId)

    setSelectedRows(newSelectedRows)
  }

  const handleTeacherChange = (groupId: number, teacherId: string) => {
    setTeacherAssignments((prev) => ({
      ...prev,
      [groupId]: teacherId
    }))
  }

  const isAllSelected = groups.length > 0 && selectedRows.length === groups.length

  useEffect(() => {
    emitSelectedGroups()
  }, [selectedRows, teacherAssignments])

  return (
    <div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-12'>
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} aria-label='Select all' />
              </TableHead>
              <TableHead>{tc('tableHeader.studentGroup')}</TableHead>
              <TableHead>{tc('tableHeader.numberOfStudents')}</TableHead>
              <TableHead>{tc('tableHeader.teacher')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className='h-24 text-center'>
                  {tc('noData')}
                </TableCell>
              </TableRow>
            ) : (
              groups.map((group: Group) => (
                <TableRow key={group.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(group.id)}
                      onCheckedChange={(checked) => handleSelectRow(group.id, checked as boolean)}
                      aria-label={`Select group ${group.code}`}
                    />
                  </TableCell>
                  <TableCell className='flex flex-col'>
                    <span className='font-medium'>{group.name}</span>
                    <span className='text-sm text-gray-500'>{group.code}</span>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Users2 className='h-4 w-4' />
                      <span className='font-medium'>{group.studentCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <SingleSelectWithSearch
                      placeholder='Chọn giáo viên'
                      options={teacherOptions}
                      value={teacherAssignments[group.id] || null}
                      onChange={(val) => handleTeacherChange(group.id, val)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
