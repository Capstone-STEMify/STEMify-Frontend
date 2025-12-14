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
import Image from 'next/image'

export function useGetLicenseAssignmentColumnTable(): ColumnDef<LicenseAssignment>[] {
  const { openModal } = useModal()
  const tc = useTranslations('common')

  return [
    createSelectColumn<LicenseAssignment>(),
    {
      accessorKey: 'user.imageUrl',
      header: tc('tableHeader.image'),
      cell: ({ row }) => {
        const src = row.original.user.imageUrl
        const alt = row.original.user.name.charAt(0)
        return (
          <div className='h-14 w-14 overflow-hidden rounded-full border'>
            {src ? (
              <Image
                src={src}
                alt='preview'
                className='h-full w-full rounded-full object-cover'
                width={56}
                height={56}
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-sky-100 text-lg font-bold text-blue-500'>
                {alt}
              </div>
            )}
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
        return <Badge className={`${getStatusBadgeClass(badgeValue)}`}>{value}</Badge>
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
