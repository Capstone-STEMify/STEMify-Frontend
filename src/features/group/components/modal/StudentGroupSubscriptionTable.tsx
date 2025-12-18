'use client'

import { Badge } from '@/components/shadcn/badge'
import { Avatar, AvatarFallback } from '@/components/shadcn/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { useLocale, useTranslations } from 'next-intl'
import { GroupDetailStudent } from '@/features/group/types/group.type'
import { formatDate, getInitials, useOrgUserStatusTranslation } from '@/utils/index'
import { AlertCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/shadcn/tooltip'
import { Checkbox } from '@/components/shadcn/checkbox'
import { useEffect, useMemo, useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { Label } from '@/components/shadcn/label'
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setMissMatchAction, setSelectedStudentsForGroup } from '@/features/classroom/slice/classroomSlice'
type Props = {
  groupId: number
  students: GroupDetailStudent[]
  selectedSubscriptionId: number | null
}

export default function StudentGroupSubscriptionTable({ groupId, students, selectedSubscriptionId }: Props) {
  const { closeModal } = useModal()

  const locale = useLocale()
  const tc = useTranslations('common')
  const ts = useTranslations('subscription')
  const dispatch = useAppDispatch()
  const orgUserStatusTranslation = useOrgUserStatusTranslation()

  const { missMatchAction, selectedStudentsByGroup } = useAppSelector((state) => state.createClassroom)
  const [selectedStudentGroupIds, setSelectedStudentGroupIds] = useState<string[]>([])

  useEffect(() => {
    const savedStudents = selectedStudentsByGroup[groupId] || []
    setSelectedStudentGroupIds(savedStudents)
  }, [groupId, selectedStudentsByGroup])

  const mismatchedStudentIds = useMemo(() => {
    if (selectedSubscriptionId === null) return new Set<string>()
    return new Set(
      students.filter((s) => s.subscriptionOrderId !== selectedSubscriptionId).map((s) => s.organizationUserId)
    )
  }, [students, selectedSubscriptionId])

  const handleCheckboxChange = (checked: boolean, studentId: string) => {
    setSelectedStudentGroupIds((prev) => (checked ? [...prev, studentId] : prev.filter((id) => id !== studentId)))
  }
  // Select-all helpers
  const selectableIds = useMemo(() => {
    const allIds = students.map((s) => s.organizationUserId)
    if (missMatchAction === 'exclude') {
      return allIds.filter((id) => !mismatchedStudentIds.has(id))
    }
    return allIds
  }, [students, mismatchedStudentIds, missMatchAction])

  const isAllSelected = useMemo(() => {
    if (selectableIds.length === 0) return false
    return selectableIds.every((id) => selectedStudentGroupIds.includes(id))
  }, [selectableIds, selectedStudentGroupIds])

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      const set = new Set([...selectedStudentGroupIds, ...selectableIds])
      setSelectedStudentGroupIds(Array.from(set))
    } else {
      setSelectedStudentGroupIds((prev) => prev.filter((id) => !selectableIds.includes(id)))
    }
  }

  const handleConfirm = () => {
    dispatch(setSelectedStudentsForGroup({ groupId, studentIds: selectedStudentGroupIds }))
    closeModal()
  }

  return (
    <div>
      <div>
        {mismatchedStudentIds.size > 0 && (
          <div className='mb-4 space-y-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
            <p>{ts('licenseNotice.message', { count: mismatchedStudentIds.size })}</p>

            <RadioGroup
              value={missMatchAction}
              onValueChange={(val) => dispatch(setMissMatchAction(val as 'autoAssign' | 'exclude'))}
              className='mt-4'
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='exclude' id='exclude' />
                <Label htmlFor='exclude' className='text-sm font-normal'>
                  {ts('licenseNotice.optionExclude')}
                </Label>
              </div>

              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='autoAssign' id='autoAssign' />
                <Label htmlFor='autoAssign' className='text-sm font-normal'>
                  {ts('licenseNotice.optionAutoAssign')}
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}
      </div>
      <div className='overflow-hidden rounded-lg border bg-white'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10'>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked) => handleToggleAll(Boolean(checked))}
                  disabled={selectableIds.length === 0}
                  aria-label='Select all'
                />
              </TableHead>
              <TableHead>{tc('tableHeader.student')}</TableHead>
              <TableHead>{tc('tableHeader.email')}</TableHead>
              <TableHead>{tc('tableHeader.joinedAt')}</TableHead>
              <TableHead>{tc('tableHeader.status')}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((student) => {
              const isMismatch = mismatchedStudentIds.has(student.organizationUserId)

              return (
                <TableRow key={student.organizationUserId}>
                  <TableCell className='w-10'>
                    {missMatchAction === 'exclude' && isMismatch ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle className='h-4 w-4 text-red-500' />
                          </TooltipTrigger>
                          <TooltipContent side='right'>
                            <p className='text-sm'>{ts('studentNotInSubscription')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Checkbox
                        checked={selectedStudentGroupIds.includes(student.organizationUserId)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(Boolean(checked), student.organizationUserId)
                        }
                      />
                    )}
                  </TableCell>

                  {/* Student */}
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-9 w-9'>
                        <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                          {getInitials(student.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-medium'>{student.fullName}</div>
                        <div className='text-muted-foreground text-xs'>{student.userName}</div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell className='text-sm'>{student.email}</TableCell>

                  {/* Joined date */}
                  <TableCell className='text-sm text-gray-600'>{formatDate(student.joinedAt, { locale })}</TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      className={student.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {student.isActive ? orgUserStatusTranslation('active') : orgUserStatusTranslation('inactive')}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <div className='mt-5 flex justify-end gap-2'>
        <Button variant={'outline'} onClick={closeModal}>
          {tc('button.cancel')}
        </Button>
        <Button onClick={handleConfirm}>{tc('button.accept')}</Button>
      </div>
    </div>
  )
}
