'use client'
import { createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { BillingCycle } from '@/features/plan/types/plan.type'
import { Badge } from '@/components/shadcn/badge'
import { OrganizationSubscription, SubscriptionStatus } from '@/features/subscription/types/subscription.type'
import { useRouter } from 'next/navigation'
import { Sparkles, Users } from 'lucide-react'

export function useGetOrganizationSubscriptionColumns(): ColumnDef<OrganizationSubscription>[] {
  const t = useTranslations('subscription.list')
  const tc = useTranslations('common')

  const router = useRouter()

  return [
    createSelectColumn<OrganizationSubscription>(),
    {
      accessorKey: 'plan',
      header: tc('tableHeader.plan'),
      cell: ({ row }) => {
        const plan = row.original.planName
        const billingCycle = row.original.planBillingCycle
        return (
          <div>
            <div className='mb-1 flex items-center gap-2'>
              <Sparkles className='mr-1 inline-block h-6 w-6 text-yellow-400' />
              <p
                className='cursor-pointer font-medium hover:underline'
                onClick={() => router.push(`/organization/subscriptions/${row.original.id}`)}
              >
                {plan}
              </p>
            </div>
            <p className='text-muted-foreground text-sm'>{t(`${billingCycle.toLowerCase()}`)}</p>
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
      accessorKey: 'pricePerSeat',
      header: tc('tableHeader.price'),
      cell: ({ row }) => {
        const raw = row.original.netAmount
        const formatted = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(raw)

        return <div className='py-4 font-semibold'>{formatted}</div>
      }
    },
    {
      accessorKey: 'curriculumCount',
      header: tc('tableHeader.curriculums')
    },
    {
      accessorKey: 'totalUsers',
      header: tc('tableHeader.users'),
      cell: ({ row }) => {
        const raw = row.original.currentStudentSeats + row.original.currentTeacherSeats
        return (
          <div className='flex items-center gap-2'>
            <Users className='h-4 w-4 text-gray-500' />
            <div>{raw}</div>
          </div>
        )
      }
    },
    {
      accessorKey: 'totalSeats',
      header: tc('tableHeader.seats'),
      cell: ({ row }) => {
        const raw = row.original.maxStudentSeats + row.original.maxTeacherSeats
        return (
          <div className='flex items-center gap-2'>
            <Users className='h-4 w-4 text-gray-500' />
            <div>{raw}</div>
          </div>
        )
      }
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
    },
    {
      accessorKey: 'billingCycle',
      enableHiding: true,
      header: '',
      cell: () => null
    }
  ]
}
