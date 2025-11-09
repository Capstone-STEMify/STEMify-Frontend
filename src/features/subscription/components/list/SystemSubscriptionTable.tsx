'use client'

import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Organization } from '@/features/organization/types/organization.type'
import { BillingCycle } from '@/features/plan/types/plan.type'
import { formatDate, formatPrice } from '@/utils/index'
import React from 'react'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { Card } from '@/components/shadcn/card'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/shadcn/button'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'

type SystemSubscriptionTableProps = {
  organization: Organization
}

export default function SystemSubscriptionTable({ organization }: SystemSubscriptionTableProps) {
  const tc = useTranslations('common')
  const router = useRouter()
  const locale = useLocale()
  const dispatch = useAppDispatch()
  const { openModal } = useModal()

  const getBillingCycleLabel = (cycle: BillingCycle | string) => {
    switch (cycle) {
      case BillingCycle.SEMIANNUAL:
        return '6 Months'
      case BillingCycle.ANNUAL:
        return '12 Months'
      default:
        return cycle
    }
  }

  return (
    <div className='space-y-6 p-6'>
      <div className='flex justify-between'>
        <h2 className='text-lg font-semibold'>Organization Subscriptions</h2>

        <Button
          size='sm'
          onClick={() => {
            router.push(`/${locale}/admin/organization/${organization.id}/create-subscription`)
          }}
        >
          <Plus className='h-4 w-4' />
          <p>Create new</p>
        </Button>
      </div>

      {organization.subscriptions.length === 0 ? (
        <p className='text-muted-foreground text-center'>No subscriptions found for this organization.</p>
      ) : (
        <Card className=''>
          <Table>
            <TableHeader className='border-b'>
              <TableRow className='bg-muted/60 text-foreground'>
                <TableHead className='font-semibold'>{tc('tableHeader.planName')}</TableHead>
                <TableHead className='font-semibold'>{tc('tableHeader.planBillingCycle')}</TableHead>
                <TableHead className='font-semibold'>{tc('tableHeader.grossAmount')}</TableHead>
                <TableHead className='font-semibold'>{tc('tableHeader.netAmount')}</TableHead>
                <TableHead className='font-semibold'>{tc('tableHeader.studentSeats')}</TableHead>
                <TableHead className='font-semibold'>{tc('tableHeader.teacherSeats')}</TableHead>
                <TableHead className='font-semibold'>{tc('tableHeader.status')}</TableHead>
                <TableHead className='font-semibold'>{tc('tableHeader.startDate')}</TableHead>
                <TableHead className='font-semibold'>{tc('tableHeader.endDate')}</TableHead>
                <TableHead className='font-semibold'>{tc('tableHeader.action')}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {organization.subscriptions.map((subscription, index) => (
                <TableRow
                  key={subscription.id ?? index}
                  className={`hover:bg-muted/40 border-b transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                >
                  <TableCell
                    className='cursor-pointer font-medium text-blue-600 hover:underline'
                    onClick={() =>
                      router.push(`/${locale}/admin/organization/${organization.id}/subscription/${subscription.id}`)
                    }
                  >
                    {subscription.planName}
                  </TableCell>
                  <TableCell>{getBillingCycleLabel(subscription.planBillingCycle ?? 'N/A')}</TableCell>

                  <TableCell className='text-muted-foreground text-sm font-medium'>
                    {formatPrice(subscription.grossAmount ?? 0) ?? '-'}
                  </TableCell>

                  <TableCell className='text-foreground text-sm font-medium'>
                    {formatPrice(subscription.netAmount ?? 0) ?? '-'}
                  </TableCell>

                  <TableCell className='space-y-1'>
                    <p>
                      <span className='text-foreground font-semibold'>{subscription.maxStudentSeats ?? '-'}</span>
                    </p>
                  </TableCell>

                  <TableCell className='space-y-1'>
                    <p>
                      <span className='text-foreground font-semibold'>{subscription.maxTeacherSeats ?? '-'}</span>
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(subscription.status)}>{subscription.status ?? 'N/A'}</Badge>
                  </TableCell>

                  <TableCell className='text-muted-foreground text-sm'>
                    {formatDate(subscription.startDate ?? 'N/A')}
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {formatDate(subscription.endDate ?? 'N/A')}
                  </TableCell>
                  <TableCell className=''>
                    <div className='flex items-center space-x-1'>
                      <button
                        className='p-1'
                        onClick={() => openModal('upsertSubscription', { subscriptionId: subscription.id })}
                      >
                        <Edit2 className='h-3.5 w-3.5' />
                      </button>
                      <button className='p-1'>
                        <Trash2 className='h-3.5 w-3.5 text-red-500' />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
