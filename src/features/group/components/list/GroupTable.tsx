import React, { useEffect, useState } from 'react'
import { SingleSelectWithSearch } from '@/components/shared/SingleSelectWithSearch'
import { useSearchGroupByOrganizationIdQuery } from '@/features/group/api/groupApi'
import { LicenseAssignmentType } from '@/features/license-assignment/types/licenseAssignment'
import { useSearchUserV2Query } from '@/features/user/api/userApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { getOptions } from '@/utils/index'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Group } from '@/features/group/types/group.type'
import { useTranslations } from 'next-intl'

type GroupTableProps = {
  onGroupsChange?: (
    groups: {
      groupCode: string
      groupName: string
      teacherId: string | null
      studentIds: string[]
    }[]
  ) => void
}

export default function GroupTable({ onGroupsChange }: GroupTableProps) {
  const tClassroom = useTranslations('classroom.create')
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [teacherAssignments, setTeacherAssignments] = useState<Record<number, string | null>>({})

  const searchUserQuery = useAppSelector((state) => state.user)
  const { selectedSubscriptionOrderId, selectedOrganizationId } = useAppSelector((state) => state.selectedOrganization)

  const { data } = useSearchGroupByOrganizationIdQuery(
    { organizationId: selectedOrganizationId!, params: {} },
    { skip: !selectedOrganizationId }
  )

  const { data: teacherData } = useSearchUserV2Query({
    ...searchUserQuery,
    license_type: LicenseAssignmentType.TEACHER,
    subscription_order_id: selectedSubscriptionOrderId
  })

  const teacherOptions = getOptions(teacherData?.data.items, 'userName', 'imageUrl', 'email')
  const groups = data?.data.items || []

  const emitSelectedGroups = () => {
    if (!onGroupsChange) return

    const selected = selectedRows.map((groupId) => {
      const group = groups.find((g) => g.id === groupId)!
      return {
        groupCode: group.code,
        groupName: group.name,
        teacherId: teacherAssignments[groupId] || null,
        // studentIds: group.students.map((s) => s.userId)
        studentIds: ['911e82f3-b889-447d-810b-e1b2ba8a6e52']
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
    let newSelectedRows = checked ? [...selectedRows, groupId] : selectedRows.filter((id) => id !== groupId)

    setSelectedRows(newSelectedRows)
  }

  const handleTeacherChange = (groupId: number, teacherId: string | null) => {
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
    <div className='w-full'>
      <h2 className='mb-4 text-lg font-semibold text-gray-900'>{tClassroom('groupList')}</h2>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-12'>
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} aria-label='Select all' />
              </TableHead>
              <TableHead>Group Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Teacher</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className='h-24 text-center'>
                  No groups found.
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
                  <TableCell className='font-medium'>{group.code}</TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span className='font-medium'>{group.name}</span>
                      <span className='text-sm text-gray-500'>
                        {group.studentCount} {group.studentCount === 1 ? 'student' : 'students'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <SingleSelectWithSearch
                      placeholder='Select teacher'
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
