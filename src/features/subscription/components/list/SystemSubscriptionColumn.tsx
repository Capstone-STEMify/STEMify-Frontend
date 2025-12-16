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
import { Badge } from '@/components/shadcn/badge'
import { getStatusBadgeClass } from '@/utils/badgeColor'

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

  const translateStatus = useStatusTranslation()

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

  const handleCancel = async (subscription: any) => {
    await updateSubscription({
      subscriptionId: subscription.id,
      body: { status: SubscriptionStatus.CANCELLED, curriculumIds: subscription.curriculumIds || [] }
    })
    toast.success(tt('successMessage.updateNoTitle'))
  }

  const handleDelete = async (id: number) => {
    await deleteSubscription(id).unwrap()
    toast.success(tt('successMessage.delete'))
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
        return (
          <Badge className={getStatusBadgeClass(row.original.status)}>{translateStatus(row.original.status)}</Badge>
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
        label: tc('button.cancel'),
        danger: true,
        hidden: ({ original }) => original.status !== SubscriptionStatus.ACTIVE,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: tt('confirmMessage.cancelledSubscriptions', { title: original.planName }),
            onConfirm: () => handleCancel(original)
          })
        }
      }
    ])
  ]
}
