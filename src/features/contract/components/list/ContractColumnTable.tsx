'use client'
import { createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { Contract } from '@/features/contract/types/contract.type'
import { Badge } from '@/components/shadcn/badge'

export function useGetContractColumnTable(): ColumnDef<Contract>[] {
  const tm = useTranslations('message')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  return [
    createSelectColumn<Contract>(),
    {
      accessorKey: 'name',
      header: tc('tableHeader.name')
    },
    {
      accessorKey: 'description',
      header: tc('tableHeader.description')
    },
    {
      accessorKey: 'organizationName',
      header: tc('tableHeader.organizationName')
    },
    {
      accessorKey: 'status',
      header: tc('tableHeader.status'),
      cell: ({ row }) => {
        return <Badge>{row.original.status}</Badge>
      }
    }
  ]
}
