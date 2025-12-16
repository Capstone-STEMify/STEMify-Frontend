'use client'

import { Badge } from '@/components/shadcn/badge'
import { Avatar, AvatarFallback } from '@/components/shadcn/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/utils/shadcn/utils'
import { GroupDetailStudent } from '@/features/group/types/group.type'
import { formatDate, useOrgUserStatusTranslation } from '@/utils/index'

type Props = {
  students: GroupDetailStudent[]
  selectedSubscriptionId: number | null
}

export default function StudentGroupSubscriptionTable({ students, selectedSubscriptionId }: Props) {
  const locale = useLocale()
  const tc = useTranslations('common')
  const orgUserStatusTranslation = useOrgUserStatusTranslation()

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  return (
    <div className='overflow-hidden rounded-lg border bg-white'>
      <Table className=''>
        <TableHeader>
          <TableRow>
            <TableHead>{tc('tableHeader.student')}</TableHead>
            <TableHead>{tc('tableHeader.email')}</TableHead>
            <TableHead>{tc('tableHeader.joinedAt')}</TableHead>
            <TableHead>{tc('tableHeader.status')}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.map((student) => {
            const isMismatch = selectedSubscriptionId !== null && student.subscriptionOrderId !== selectedSubscriptionId

            return (
              <TableRow key={student.userId} className={cn(isMismatch && 'bg-red-50')}>
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
                  <Badge className={student.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {student.isActive ? orgUserStatusTranslation('active') : orgUserStatusTranslation('inactive')}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
