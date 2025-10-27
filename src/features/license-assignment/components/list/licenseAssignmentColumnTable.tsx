'use client'
import { createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { Contact, ContactStatus } from '@/features/contact/types/contact.type'
import { Badge } from '@/components/shadcn/badge'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { CheckCircle } from 'lucide-react'
import { LicenseAssignment } from '@/features/license-assignment/types/licenseAssignment'
import { formatDate } from '@/utils/index'

export function useGetLicenseAssignmentColumnTable(): ColumnDef<LicenseAssignment>[] {
  const { openModal } = useModal()
  const tm = useTranslations('message')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  return [
    createSelectColumn<LicenseAssignment>(),
    {
      accessorKey: 'userImageUrl',
      header: tc('tableHeader.image')
    },
    {
      accessorKey: 'userName',
      header: tc('tableHeader.name')
    },
    {
      accessorKey: 'userEmail',
      header: tc('tableHeader.email')
    },
    {
      accessorKey: 'status',
      header: tc('tableHeader.status'),
      cell: ({ row }) => {
        const value = row.getValue<LicenseAssignment['status']>('status')
        const badgeValue = value.toLocaleUpperCase() as LicenseAssignment['status']
        return <Badge className={`${getStatusBadgeClass(badgeValue)}`}>{value}</Badge>
      }
    },
    {
      accessorKey: 'type',
      header: tc('tableHeader.accountType')
    },
    {
      accessorKey: 'assignedAt',
      header: tc('tableHeader.assignedDate'),
      cell: ({ row }) => {
        const value = row.getValue<LicenseAssignment['assignedAt']>('assignedAt')
        return <p>{formatDate(value)}</p>
      }
    }
  ]
}
