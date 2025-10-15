'use client'
import { createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { OrganizationSubscription, SubscriptionStatus } from '@/features/organization-package/types/subscription.type'
import { Badge } from 'lucide-react'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { BillingCycle } from '@/features/plan/types/plan.type'

export function useGetOrganizationSubscriptionColumns(): ColumnDef<OrganizationSubscription>[] {
  const { openModal } = useModal()
  const tm = useTranslations('message')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  return [
    createSelectColumn<OrganizationSubscription>(),
    {
      accessorKey: 'plan',
      header: tc('tableHeader.plan'),
      cell: ({ row }) => {
        const plan = row.getValue<string>('plan')
        const billingCycle = row.getValue<BillingCycle>('billingCycle')
        return (
          <div>
            <p className='font-medium'>{plan}</p>
            <p className='text-muted-foreground text-sm'>{billingCycle}</p>
          </div>
        )
      }
    },
    {
      accessorKey: 'status',
      header: tc('tableHeader.status'),
      cell: ({ row }) => {
        const value = row.getValue<SubscriptionStatus>('status')
        return <Badge className={`${getStatusBadgeClass(value)}`}>{value}</Badge>
      }
    },
    {
      accessorKey: 'price',
      header: tc('tableHeader.price')
    },
    {
      accessorKey: 'totalCurriculums',
      header: tc('tableHeader.totalCurriculums')
    },
    {
      accessorKey: 'totalSeats',
      header: tc('tableHeader.totalSeats')
    },
    {
      accessorKey: 'startDate',
      header: tc('tableHeader.startDate'),
      cell: ({ row }) => {
        const raw = row.getValue<string>('startDate')
        const date = raw ? new Date(raw).toLocaleDateString('vi-VN') : 'N/A'
        return <div>{date}</div>
      }
    },
    {
      accessorKey: 'endDate',
      header: tc('tableHeader.endDate'),
      cell: ({ row }) => {
        const raw = row.getValue<string>('endDate')
        const date = raw ? new Date(raw).toLocaleDateString('vi-VN') : 'N/A'
        return <div>{date}</div>
      }
    }
  ]
}
