import React from 'react'
import { useTranslations } from 'next-intl'
import { ColumnDef } from '@tanstack/react-table'
import { useParams, useRouter } from 'next/navigation'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useLocale } from 'next-intl'
import SStatusDropdown from '@/components/shared/SStatusDropdown'
import { formatDate, formatPrice, useStatusTranslation } from '@/utils/index'
import {
  useDeleteSubscriptionMutation,
  useUpdateSubscriptionMutation
} from '@/features/subscription/api/subscriptionApi'
import { OrganizationSubscription, SubscriptionStatus } from '@/features/subscription/types/subscription.type'
import { BillingCycle } from '@/features/plan/types/plan.type'

export function useSystemSubscriptionColumn(): ColumnDef<OrganizationSubscription>[] {
  const { organizationId } = useParams()
  const router = useRouter()
  const locale = useLocale()
  const { openModal } = useModal()
  const [deleteSubscription] = useDeleteSubscriptionMutation()
  const [updateSubscription] = useUpdateSubscriptionMutation()
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const to = useTranslations('organization.subscription')

  const getBillingCycleLabel = (cycle: BillingCycle | string) => {
    switch (cycle) {
      case BillingCycle.SEMIANNUAL:
        return `6 ${to('months')}`
      case BillingCycle.ANNUAL:
        return `12 ${to('months')}`
      default:
        return cycle
    }
  }

  const handleNavigate = (id: number) => {
    router.push(`/${locale}/admin/organization/${organizationId}/subscription/${id}`)
  }

  const handleStatusChange = (subscription: any, newStatus: string) => {
    updateSubscription({
      subscriptionId: subscription.id,
      body: {
        status: newStatus as SubscriptionStatus,
        // add curriculumIds to avoid removing them unintentionally (for grpc compatibility)
        curriculumIds: subscription.curriculumIds || []
      }
    })
  }

  const handleArchive = async (subscription: OrganizationSubscription) => {
    await updateSubscription({
      subscriptionId: subscription.id,
      body: { status: SubscriptionStatus.ARCHIVED }
    })
    toast.success(tt('successMessage.update', { title: SubscriptionStatus.ARCHIVED }))
  }

  const handleDelete = async (id: number) => {
    await deleteSubscription(id).unwrap()
    toast.success(tt('successMessage.delete'))
  }

  const SubscriptionStatusOption = [
    { label: 'Pending', value: SubscriptionStatus.PENDING },
    { label: 'Active', value: SubscriptionStatus.ACTIVE },
    { label: 'Archived', value: SubscriptionStatus.ARCHIVED },
    { label: 'Cancelled', value: SubscriptionStatus.CANCELLED },
    { label: 'Expired', value: SubscriptionStatus.EXPIRED }
  ]

  const SubscriptionStatusFlow: Record<SubscriptionStatus, SubscriptionStatus[]> = {
    [SubscriptionStatus.PENDING]: [SubscriptionStatus.PENDING, SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELLED],
    [SubscriptionStatus.ACTIVE]: [SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELLED],
    [SubscriptionStatus.ARCHIVED]: [
      SubscriptionStatus.ACTIVE,
      SubscriptionStatus.ARCHIVED,
      SubscriptionStatus.CANCELLED
    ],
    [SubscriptionStatus.CANCELLED]: [],
    [SubscriptionStatus.EXPIRED]: []
  }

  return [
    createSelectColumn<OrganizationSubscription>(),
    {
      accessorKey: 'planName',
      header: () => <div>{tc('tableHeader.name')}</div>,
      cell: ({ row }) => {
        const subscriptionId = row.original.id
        return (
          <div>
            <div
              onClick={() => handleNavigate(subscriptionId)}
              className='cursor-pointer font-bold transition hover:opacity-80'
            >
              {row.original.planName}
            </div>
            <div>{getBillingCycleLabel(row.original.planBillingCycle)}</div>
          </div>
        )
      },
      enableSorting: true
    },

    {
      accessorKey: 'netAmount',
      header: () => <div>{tc('tableHeader.netAmount')}</div>,
      cell: ({ row }) => {
        return <div>{formatPrice(row.original.netAmount)}</div>
      }
    },

    {
      accessorKey: 'teacherSeats',
      header: () => <div>{tc('tableHeader.teacherSeats')}</div>,
      cell: ({ row }) => {
        return <div>{row.original.maxTeacherSeats}</div>
      }
    },
    {
      accessorKey: 'studentSeats',
      header: () => <div>{tc('tableHeader.studentSeats')}</div>,
      cell: ({ row }) => {
        return <div>{row.original.maxStudentSeats}</div>
      }
    },
    {
      accessorKey: 'startDate',
      header: () => <div>{tc('tableHeader.startDate')}</div>,
      cell: ({ row }) => {
        return <div>{formatDate(row.original.startDate, { locale: locale as 'en' | 'vi' })}</div>
      }
    },
    {
      accessorKey: 'endDate',
      header: () => <div>{tc('tableHeader.endDate')}</div>,
      cell: ({ row }) => {
        return <div>{formatDate(row.original.endDate, { locale: locale as 'en' | 'vi' })}</div>
      }
    },
    {
      accessorKey: 'status',
      header: () => <div>{tc('tableHeader.status')}</div>,
      cell: ({ row }) => {
        const subscription = row.original
        const allowedOptions = SubscriptionStatusOption.filter(
          (sub) =>
            subscription.status && SubscriptionStatusFlow[subscription.status].includes(sub.value as SubscriptionStatus)
        )
        return (
          <SStatusDropdown
            value={row.original.status!}
            options={allowedOptions}
            onChange={(newStatus) => handleStatusChange(row.original, newStatus)}
          />
        )
      }
    },
    createActionsColumnFromItems<OrganizationSubscription>([
      {
        label: tc('button.view'),
        onClick: ({ original }) => {
          router.push(`/${locale}/admin/organization/${organizationId}/subscription/${original.id}`)
        }
      },
      {
        label: tc('button.archive'),
        archive: true,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: tt('confirmMessage.archive', { title: original.planName }),
            onConfirm: () => handleArchive(original)
          })
        }
      },
      {
        label: tc('button.delete'),
        danger: true,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: tt('confirmMessage.delete', { title: original.planName }),
            onConfirm: () => handleDelete(original.id)
          })
        }
      }
    ])
  ]
}
