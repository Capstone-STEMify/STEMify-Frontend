'use client'
import { createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { Contact, ContactStatus } from '@/features/contact/types/contact.type'
import { Badge } from '@/components/shadcn/badge'
import { getStatusBadgeClass } from '@/utils/badgeColor'

export function useGetContactColumnTable(): ColumnDef<Contact>[] {
  const { openModal } = useModal()
  const tm = useTranslations('message')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  return [
    createSelectColumn<Contact>(),
    {
      accessorKey: 'firstName',
      header: tc('tableHeader.firstName')
    },
    {
      accessorKey: 'lastName',
      header: tc('tableHeader.lastName')
    },
    {
      accessorKey: 'emailAddress',
      header: tc('tableHeader.email')
    },
    {
      accessorKey: 'phoneNumber',
      header: tc('tableHeader.phoneNumber')
    },
    {
      accessorKey: 'organizationName',
      header: tc('tableHeader.organizationName')
    },
    {
      accessorKey: 'organizationType',
      header: tc('tableHeader.organizationType')
    },
    {
      accessorKey: 'createdAt',
      header: tc('tableHeader.createdAt')
    },
    {
      accessorKey: 'jobRoleName',
      header: tc('tableHeader.jobRole')
    },
    {
      accessorKey: 'status',
      header: tc('tableHeader.status'),
      cell: ({ row }) => {
        const value = row.getValue<ContactStatus>('status')
        const badgeValue = value.toLocaleUpperCase() as ContactStatus
        return <Badge className={`${getStatusBadgeClass(badgeValue)}`}>{value}</Badge>
      }
    }
  ]
}
