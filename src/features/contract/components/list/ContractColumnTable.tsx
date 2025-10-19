'use client'
import { createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { Contract } from '@/features/contract/types/contract.type'

export function useGetContractColumnTable(): ColumnDef<Contract>[] {
  const { openModal } = useModal()
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
    }
  ]
}
