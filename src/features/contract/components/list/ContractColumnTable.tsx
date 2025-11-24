'use client'
import { createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { Contract } from '@/features/contract/types/contract.type'
import { Badge } from '@/components/shadcn/badge'
import Image from 'next/image'
import { Download } from 'lucide-react'

export function useGetContractColumnTable(): ColumnDef<Contract>[] {
  const tc = useTranslations('common')

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
      accessorKey: 'organization.name',
      header: tc('tableHeader.organizationName')
    },
    {
      accessorKey: 'organization.organizationType',
      header: tc('tableHeader.organizationType')
    },
    {
      accessorKey: 'organization.imageUrl',
      header: tc('tableHeader.organizationImage'),
      cell: ({ row }) => {
        const src = row.original.organization.imageUrl
        return (
          <div className='h-14 w-14 overflow-hidden rounded border'>
            {src ? (
              <Image src={src} alt='preview' className='h-full w-full object-cover' width={56} height={56} />
            ) : (
              <div className='text-muted flex h-full w-full items-center justify-center text-xs'>{tc('noImage')}</div>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'status',
      header: tc('tableHeader.status'),
      cell: ({ row }) => {
        return <Badge>{row.original.status}</Badge>
      }
    },
    {
      accessorKey: 'fileUrl',
      header: () => <div className='text-center'>{tc('tableHeader.downloadFile')}</div>,
      cell: ({ row }) => {
        // download icon with link to fileUrl
        const fileUrl = row.original.fileUrl
        return fileUrl ? (
          <a href={fileUrl} target='_blank' rel='noopener noreferrer' className='flex w-full justify-center'>
            <Download className='h-5 w-5 text-gray-600 hover:text-gray-800' />
          </a>
        ) : (
          <span className='text-gray-500'>{tc('noFile')}</span>
        )
      }
    }
  ]
}
