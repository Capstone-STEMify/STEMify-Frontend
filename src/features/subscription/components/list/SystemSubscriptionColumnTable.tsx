'use client'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useLocale, useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/shadcn/badge'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import Image from 'next/image'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  OrganizationStatus,
  OrganizationSubscription,
  SubscriptionStatus
} from '@/features/subscription/types/subscription.type'
import { BillingCycle } from '@/features/plan/types/plan.type'
import { ArrowDown, ChevronDown } from 'lucide-react'

export function useGetOrganizationColumnTable(): ColumnDef<OrganizationSubscription>[] {
  const { openModal } = useModal()
  const tm = useTranslations('message')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const router = useRouter()
  const locale = useLocale()
  const handleDelete = async (id: number) => {
    try {
      //   await deleteAgeRange(id).unwrap()
      toast.success(`${tt('successMessage.delete', { title: id || '' })}`)
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  return [
    createSelectColumn<OrganizationSubscription>(),
    {
      accessorKey: 'organizationImageUrl',
      header: tc('tableHeader.image'),
      cell: ({ row }) => {
        const src = row.getValue<string>('organizationImageUrl')
        return (
          <div className='h-14 w-14 overflow-hidden rounded-full'>
            {src ? (
              <Image
                src={src}
                alt='preview'
                className='h-full w-full rounded-full object-cover'
                width={56}
                height={56}
              />
            ) : (
              <div className='text-muted flex h-full w-full items-center justify-center text-xs'>{tc('noImage')}</div>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'organizationName',
      header: tc('tableHeader.organizationName'),
      cell: ({ row }) => {
        const organizationName = row.getValue<string>('organizationName')
        const organizationId = row.getValue<string>('organizationId')
        return (
          <div>
            <p className='font-semibold'>{organizationName}</p>
            <p className='text-muted-foreground text-sm'>ID: {organizationId}</p>
          </div>
        )
      }
    },
    {
      accessorKey: 'totalUsers',
      header: tc('tableHeader.users')
    },
    {
      accessorKey: 'totalSeats',
      header: tc('tableHeader.seats')
    },
    {
      accessorKey: 'plan',
      header: tc('tableHeader.pricePlan'),
      cell: ({ row }) => {
        const plan = row.getValue<string>('plan')
        const billingCycle = row.getValue<BillingCycle>('billingCycle')
        const pricePerSeat = row.getValue<number>('pricePerSeat')
        return (
          <div>
            <p className='font-semibold'>
              {plan} - {billingCycle}
            </p>
            <p className='text-muted-foreground text-sm'>đ{pricePerSeat} per seat</p>
          </div>
        )
      }
    },
    {
      accessorKey: 'billingCycle',
      enableHiding: true,
      header: '',
      cell: () => null
    },
    {
      accessorKey: 'pricePerSeat',
      enableHiding: true,
      header: '',
      cell: () => null
    },
    {
      accessorKey: 'organizationId',
      enableHiding: true,
      header: '',
      cell: () => null
    },
    {
      accessorKey: 'status',
      header: tc('tableHeader.status'),
      cell: ({ row }) => {
        const value = row.getValue<SubscriptionStatus>('status')
        const badgeValue = value.toLocaleUpperCase() as SubscriptionStatus
        return <Badge className={`${getStatusBadgeClass(badgeValue)}`}>{value}</Badge>
      }
    },
    {
      accessorKey: 'endDate',
      header: tc('tableHeader.expiredDate')
    },
    createActionsColumnFromItems<OrganizationSubscription>([
      {
        label: tc('button.view'),
        onClick: ({ original }) => {
          router.push(`/${locale}/admin/subscriptions/${original.id}`)
        }
      },
      {
        label: tc('button.update'),
        onClick: ({ original }) => {
          openModal('upsertOrganization', { id: original.id })
        }
      }
    ]),
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        return <ChevronDown className='cursor-pointer text-gray-700' size={16} />
      }
    }
  ]
}
