'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { ColumnDef } from '@tanstack/react-table'
import { createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import z from 'zod'
import Image from 'next/image'
import { Kit } from '@/features/resource/kit/types/kit.type'

export const kitTableSchema = z.object({
  id: z.number()
})

export function useGetKitColumn(): ColumnDef<Kit>[] {
  const tc = useTranslations('common')

  return [
    createSelectColumn<Kit>(),
    {
      accessorKey: 'id',
      header: tc('tableHeader.id'),
      cell: ({ row }) => row.getValue('id')
    },
    {
      accessorKey: 'imageUrl',
      header: () => <div>{tc('tableHeader.image')}</div>,
      cell: ({ row }) => {
        const src = row.getValue<string>('imageUrl')
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
      accessorKey: 'name',
      header: () => <div>{tc('tableHeader.name')}</div>,
      cell: ({ row }) => {
        return (
          <div className='line-clamp-3 w-32 whitespace-pre-wrap'>
            <div className='font-bold'>{row.getValue('name')}</div>
          </div>
        )
      }
    }
  ]
}
