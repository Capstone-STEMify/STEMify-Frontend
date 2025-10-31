import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { MoreHorizontal, UserPlus, Mail, User, Calendar } from 'lucide-react'
import { useSearchLicenseAssignmentQuery } from '@/features/license-assignment/api/licenseAssignmentApi'
import { Skeleton } from '@/components/shadcn/skeleton'
import { formatDateV2 } from '@/utils/index'

type OrganizationAdminsProps = {
  organizationSubscriptionOrderId?: number
}

export default function OrganizationAdmins({ organizationSubscriptionOrderId }: OrganizationAdminsProps) {
  const { data, isLoading } = useSearchLicenseAssignmentQuery(
    {
      organizationSubscriptionOrderId: organizationSubscriptionOrderId!,
      pageNumber: 1,
      pageSize: 10
    },
    { skip: !organizationSubscriptionOrderId }
  )

  const licenseAssignments = data?.data.items || []
  const totalCount = data?.data.totalCount || 0

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
        <div className='flex items-center justify-between border-b px-5 pb-4'>
          <div>
            <CardTitle className='text-lg font-semibold'>License Assignments</CardTitle>
            <p className='text-muted-foreground mt-0.5 text-sm'>{totalCount} members</p>
          </div>
          <Button size='sm' className='gap-2'>
            <UserPlus size={16} />
            Add Member
          </Button>
        </div>
        {licenseAssignments.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='mb-3 rounded-full bg-gray-100 p-4'>
              <User size={24} className='text-gray-400' />
            </div>
            <p className='text-muted-foreground text-sm'>No license assignments yet</p>
            <Button variant='link' className='mt-2' size='sm'>
              Assign your first license
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50/50'>
                <TableHead className='w-[40%]'>
                  <div className='flex items-center gap-1.5'>
                    <Mail size={14} />
                    <span>Email</span>
                  </div>
                </TableHead>
                <TableHead className='w-[25%]'>
                  <div className='flex items-center gap-1.5'>
                    <User size={14} />
                    <span>Name</span>
                  </div>
                </TableHead>
                <TableHead className='w-[15%]'>Role</TableHead>
                <TableHead className='w-[15%]'>
                  <div className='flex items-center gap-1.5'>
                    <Calendar size={14} />
                    <span>Assigned</span>
                  </div>
                </TableHead>
                <TableHead className='w-[5%]'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenseAssignments.map((assignment) => (
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
                    <span className='text-sm'>{formatDateV2(new Date(assignment.assignedAt))}</span>
                  </TableCell>
                  <TableCell>
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
