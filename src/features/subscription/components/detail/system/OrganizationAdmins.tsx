import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import {
  UserPlus,
  Mail,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  MoreVertical,
  Trash2,
  RefreshCcw,
  RotateCcw,
  RotateCw
} from 'lucide-react'
import {
  useDeleteLicenseAssignmentMutation,
  useSearchLicenseAssignmentQuery
} from '@/features/license-assignment/api/licenseAssignmentApi'
import { Skeleton } from '@/components/shadcn/skeleton'
import { formatDate, formatDateV2, useStatusTranslation } from '@/utils/index'
import { useModal } from '@/providers/ModalProvider'
import { cn } from '@/utils/shadcn/utils'
import { LicenseAssignmentStatus } from '@/features/license-assignment/types/licenseAssignment'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { resetParams, setParam } from '@/features/license-assignment/slice/licenseAssignmentSlice'
import { toast } from 'sonner'
import { useLocale, useTranslations } from 'next-intl'
import { getStatusBadgeClass } from '@/utils/badgeColor'

type OrganizationAdminsProps = {
  organizationSubscriptionOrderId?: number
}

type StatusFilter = LicenseAssignmentStatus.ACTIVE | LicenseAssignmentStatus.PENDING

export default function OrganizationAdmins({ organizationSubscriptionOrderId }: OrganizationAdminsProps) {
  const tc = useTranslations('common')
  const to = useTranslations('organization.detail')
  const tt = useTranslations('toast')
  const statusTranslate = useStatusTranslation()

  const [isRotating, setIsRotating] = useState(false)

  const locale = useLocale()
  const { openModal } = useModal()
  const dispatch = useAppDispatch()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(LicenseAssignmentStatus.ACTIVE)

  const licenseParams = useAppSelector((state) => state.licenseAssignment)
  const { data, isLoading, refetch } = useSearchLicenseAssignmentQuery(
    {
      ...licenseParams,
      organizationSubscriptionOrderId: organizationSubscriptionOrderId!
    },
    { skip: !organizationSubscriptionOrderId }
  )

  const [deleteLicense] = useDeleteLicenseAssignmentMutation()

  const licenseAssignments = data?.data.items || []
  const totalCount = data?.data.totalCount || 0

  useEffect(() => {
    dispatch(resetParams())
  }, [dispatch])

  const handleRotate = async () => {
    setIsRotating(true)
    refetch()

    setTimeout(() => setIsRotating(false), 700)
  }

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

  return (
    <Card className='py-4'>
      <CardContent className='p-0'>
        {/* Header */}
        <div className='flex items-center justify-between border-b px-5 pb-4'>
          <div>
            <CardTitle className='text-lg font-semibold'>
              <div className='flex items-center gap-2'>
                <div>{to('license.header')}</div>
                <button onClick={handleRotate} className='inline-flex items-center text-sm'>
                  {isRotating ? (
                    <RotateCw className='h-3.5 w-3.5 animate-spin' />
                  ) : (
                    <RotateCw className='h-3.5 w-3.5' />
                  )}
                </button>
              </div>
            </CardTitle>
            <p className='text-muted-foreground mt-0.5 text-sm'>
              {totalCount} {to('license.member')}
            </p>
          </div>
          <Button
            size='sm'
            className='gap-2'
            onClick={() => openModal('uploadCSV', { organizationSubscriptionOrderId: organizationSubscriptionOrderId })}
          >
            <UserPlus size={16} />
            {tc('button.assignLicense')}
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
              <span>{to('license.active')}</span>
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
              <span>{to('license.pending')}</span>
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
            <p className='text-muted-foreground text-sm'>{to('license.noActive')}</p>
          </div>
        ) : (
          <div className='m-4 rounded-xl border-2 border-gray-200'>
            <Table>
              <TableHeader>
                <TableRow className='bg-gray-50/50'>
                  <TableHead className='w-[30%]'>
                    <div className='flex items-center gap-1.5'>
                      <Mail size={14} />
                      <span>Email</span>
                    </div>
                  </TableHead>
                  <TableHead className='w-[20%]'>
                    <div className='flex items-center gap-1.5'>
                      <User size={14} />
                      <span>{to('license.name')}</span>
                    </div>
                  </TableHead>
                  <TableHead className='w-[15%]'>{to('license.role')}</TableHead>
                  <TableHead className='w-[13%]'>
                    <span>{to('license.assignedAt')}</span>
                  </TableHead>
                  <TableHead className='w-[12%]'>{to('license.status')}</TableHead>

                  <TableHead className='w-[5%]'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {licenseAssignments.map((assignment) => {
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
                          {assignment.user.name ? (
                            <>
                              <span className='font-medium'>{assignment.user.name}</span>
                              {assignment.user.userRole && (
                                <span className='text-muted-foreground text-xs'>
                                  {tc(`accountType.${assignment.user.userRole.toLowerCase()}`)}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className='text-muted-foreground italic'>-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getTypeBadge(assignment.type)} text-xs`}>
                          {tc(`accountType.${assignment.type.toLowerCase()}`)}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <span className='text-sm'>
                          {formatDate(assignment.assignedAt, { locale: locale as 'en' | 'vi' })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadgeClass(assignment.status)} text-xs`}>
                          {statusTranslate(assignment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <button
                          className='flex h-8 w-8 items-center'
                          onClick={() => {
                            openModal('confirm', {
                              message: `${tt('confirmMessage.delete', { title: assignment.user.email })}`,
                              onConfirm: async () => {
                                await deleteLicense(assignment.id)
                                toast.success(tt('successMessage.delete'))
                              }
                            })
                          }}
                        >
                          <Trash2 className='h-4 w-4 text-red-600' />
                        </button>
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
