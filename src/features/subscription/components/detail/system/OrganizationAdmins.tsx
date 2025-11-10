import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { MoreHorizontal, UserPlus, Mail, User, Calendar, CheckCircle2, Clock } from 'lucide-react'
import { useSearchLicenseAssignmentQuery } from '@/features/license-assignment/api/licenseAssignmentApi'
import { Skeleton } from '@/components/shadcn/skeleton'
import { formatDateV2 } from '@/utils/index'
import { useModal } from '@/providers/ModalProvider'
import { cn } from '@/utils/shadcn/utils'
import { LicenseAssignmentStatus } from '@/features/license-assignment/types/licenseAssignment'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { resetParams, setParam } from '@/features/license-assignment/slice/licenseAssignmentSlice'

type OrganizationAdminsProps = {
  organizationSubscriptionOrderId?: number
}

type StatusFilter = LicenseAssignmentStatus.ACTIVE | LicenseAssignmentStatus.PENDING

export default function OrganizationAdmins({ organizationSubscriptionOrderId }: OrganizationAdminsProps) {
  const { openModal } = useModal()
  const dispatch = useAppDispatch()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(LicenseAssignmentStatus.ACTIVE)

  const licenseParams = useAppSelector((state) => state.licenseAssignment)
  const { data, isLoading } = useSearchLicenseAssignmentQuery(
    {
      ...licenseParams,
      organizationSubscriptionOrderId: organizationSubscriptionOrderId!
    },
    { skip: !organizationSubscriptionOrderId }
  )

  const licenseAssignments = data?.data.items || []
  const totalCount = data?.data.totalCount || 0

  useEffect(() => {
    dispatch(resetParams())
  }, [dispatch])

  if (isLoading) {
    return (
      <Card className='border shadow-sm'>
        <CardHeader className='border-b bg-gray-50 pb-4'>
          <Skeleton className='h-6 w-48' />
        </CardHeader>
        <CardContent className='p-5'>
          <div className='space-y-3'>
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
          </div>
        </CardContent>
      </Card>
    )
  }

  const getTypeBadge = (type: string) => {
    const config = {
      Teacher: 'bg-blue-100 text-blue-700',
      Student: 'bg-purple-100 text-purple-700',
      Admin: 'bg-green-100 text-green-700'
    }
    return config[type as keyof typeof config] || 'bg-gray-100 text-gray-700'
  }

  const getStatusBadge = (status: string) => {
    const config = {
      active: { className: 'bg-green-100 text-green-700', label: 'Active' },
      pending: { className: 'bg-yellow-100 text-yellow-700', label: 'Pending' }
    }
    return config[status?.toLowerCase() as keyof typeof config] || config.pending
  }

  return (
    <Card className='py-4'>
      <CardContent className='p-0'>
        {/* Header */}
        <div className='flex items-center justify-between border-b px-5 pb-4'>
          <div>
            <CardTitle className='text-lg font-semibold'>License Assignments</CardTitle>
            <p className='text-muted-foreground mt-0.5 text-sm'>{totalCount} members</p>
          </div>
          <Button
            size='sm'
            className='gap-2'
            onClick={() => openModal('uploadCSV', { organizationSubscriptionOrderId: organizationSubscriptionOrderId })}
          >
            <UserPlus size={16} />
            Assign License
          </Button>
        </div>

        {/* Status Filter Navigation */}
        <div className='border-b px-5'>
          <div className='flex items-center gap-6'>
            <button
              onClick={() => {
                setStatusFilter(LicenseAssignmentStatus.ACTIVE)
                dispatch(setParam({ key: 'status', value: LicenseAssignmentStatus.ACTIVE }))
              }}
              className={cn(
                'relative flex items-center gap-2 py-3 text-sm font-medium transition-colors',
                statusFilter === LicenseAssignmentStatus.ACTIVE
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <CheckCircle2 size={16} />
              <span>Active</span>
              {statusFilter === LicenseAssignmentStatus.ACTIVE && (
                <div className='absolute right-0 bottom-0 left-0 h-0.5 bg-blue-600'></div>
              )}
            </button>

            <button
              onClick={() => {
                setStatusFilter(LicenseAssignmentStatus.PENDING)
                dispatch(setParam({ key: 'status', value: LicenseAssignmentStatus.PENDING }))
              }}
              className={cn(
                'relative flex items-center gap-2 py-3 text-sm font-medium transition-colors',
                statusFilter === LicenseAssignmentStatus.PENDING
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Clock size={16} />
              <span>Pending</span>
              {statusFilter === LicenseAssignmentStatus.PENDING && (
                <div className='absolute right-0 bottom-0 left-0 h-0.5 bg-blue-600'></div>
              )}
            </button>
          </div>
        </div>

        {/* Table Content */}
        {licenseAssignments.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='mb-3 rounded-full bg-gray-100 p-4'>
              <User size={24} className='text-gray-400' />
            </div>
            <p className='text-muted-foreground text-sm'>No {statusFilter} license assignments</p>
          </div>
        ) : (
          <div className='m-4 rounded-xl border-2 border-gray-200'>
            <Table>
              <TableHeader>
                <TableRow className='bg-gray-50/50'>
                  <TableHead className='w-[35%]'>
                    <div className='flex items-center gap-1.5'>
                      <Mail size={14} />
                      <span>Email</span>
                    </div>
                  </TableHead>
                  <TableHead className='w-[20%]'>
                    <div className='flex items-center gap-1.5'>
                      <User size={14} />
                      <span>Name</span>
                    </div>
                  </TableHead>
                  <TableHead className='w-[15%]'>Role</TableHead>
                  <TableHead className='w-[12%]'>Status</TableHead>
                  <TableHead className='w-[13%]'>
                    <div className='flex items-center gap-1.5'>
                      <Calendar size={14} />
                      <span>Assigned</span>
                    </div>
                  </TableHead>
                  <TableHead className='w-[5%]'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {licenseAssignments.map((assignment) => {
                  const statusInfo = getStatusBadge(assignment.status || 'pending')
                  return (
                    <TableRow key={assignment.id} className='hover:bg-gray-50/50'>
                      <TableCell>
                        <div className='flex flex-col'>
                          <span className='font-medium text-blue-600'>{assignment.user.email}</span>
                          {assignment.user.userName && (
                            <span className='text-muted-foreground text-xs'>@{assignment.user.userName}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col'>
                          {assignment.user.firstName || assignment.user.lastName ? (
                            <>
                              <span className='font-medium'>
                                {assignment.user.firstName} {assignment.user.lastName}
                              </span>
                              {assignment.user.userRole && (
                                <span className='text-muted-foreground text-xs'>{assignment.user.userRole}</span>
                              )}
                            </>
                          ) : (
                            <span className='text-muted-foreground italic'>Not set</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getTypeBadge(assignment.type)} text-xs`}>{assignment.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusInfo.className} text-xs`}>{statusInfo.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className='text-sm'>{formatDateV2(new Date(assignment.assignedAt))}</span>
                      </TableCell>
                      <TableCell>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
