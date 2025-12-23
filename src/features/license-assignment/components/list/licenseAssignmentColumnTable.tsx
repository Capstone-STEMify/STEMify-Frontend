'use client'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/shadcn/badge'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { LicenseAssignment, LicenseAssignmentStatus } from '@/features/license-assignment/types/licenseAssignment'
import { formatDate, stringToHslColor, useStatusTranslation } from '@/utils/index'
import { useUpdateLicenseAssignmentMutation } from '@/features/license-assignment/api/licenseAssignmentApi'
import { toast } from 'sonner'
import UserAvatar from '@/components/shared/UserAvatar'

export function useGetLicenseAssignmentColumnTable(): ColumnDef<LicenseAssignment>[] {
  const { openModal } = useModal()
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const statusTranslations = useStatusTranslation()

  const [revokeLicenseAssignment] = useUpdateLicenseAssignmentMutation()

  const handleRevoke = async (id: number) => {
    await revokeLicenseAssignment({ id, body: { status: LicenseAssignmentStatus.REVOKED } }).unwrap()
    toast.success(tt('successMessage.revoke'))
  }

  return [
    createSelectColumn<LicenseAssignment>(),
    {
      accessorKey: 'user.imageUrl',
      header: tc('tableHeader.avatar'),
      cell: ({ row }) => {
        return (
          <div className='flex items-center justify-center'>
            <UserAvatar size={30} fullName={row.original.user.name} />
          </div>
        )
      }
    },
    {
      accessorKey: 'user.name',
      header: tc('tableHeader.name')
    },
    {
      accessorKey: 'user.email',
      header: tc('tableHeader.email')
    },
    {
      accessorKey: 'status',
      header: tc('tableHeader.status'),
      cell: ({ row }) => {
        const value = row.original.status.toString()
        const badgeValue = value.toLocaleUpperCase() as LicenseAssignment['status']
        return <Badge className={`${getStatusBadgeClass(badgeValue)}`}>{statusTranslations(value)}</Badge>
      }
    },
    {
      accessorKey: 'type',
      header: tc('tableHeader.accountType'),
      cell: ({ row }) => {
        const value = row.original.type
        return <p>{tc(`accountType.${value.toLowerCase()}`)}</p>
      }
    },
    {
      accessorKey: 'assignedAt',
      header: tc('tableHeader.assignedDate'),
      cell: ({ row }) => {
        const value = row.getValue<LicenseAssignment['assignedAt']>('assignedAt')
        return <p>{formatDate(value)}</p>
      }
    },
    createActionsColumnFromItems<LicenseAssignment>([
      {
        label: tc('button.revoke'),
        onClick: ({ original }) => {
          openModal('confirm', {
            message: tt('confirmMessage.revokeLicenseAssignment'),
            onConfirm: () => handleRevoke(original.id)
          })
        }
      }
    ])
  ]
}
