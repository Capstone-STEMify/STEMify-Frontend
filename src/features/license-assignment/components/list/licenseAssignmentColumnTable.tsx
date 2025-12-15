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
import { formatDate, stringToHslColor, useStatusTranslation } from '@/utils/index'
import Image from 'next/image'

export function useGetLicenseAssignmentColumnTable(): ColumnDef<LicenseAssignment>[] {
  const { openModal } = useModal()
  const tc = useTranslations('common')
  const statusTranslations = useStatusTranslation()

  return [
    createSelectColumn<LicenseAssignment>(),
    {
      accessorKey: 'user.imageUrl',
      header: tc('tableHeader.image'),
      cell: ({ row }) => {
        const alt = row.original.user.name
        return (
          <div
            className='flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white shadow-sm ring-1 ring-black/5 select-none'
            style={{
              backgroundColor: stringToHslColor(alt)
            }}
          >
            {alt.charAt(0).toUpperCase()}
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
    }
  ]
}
