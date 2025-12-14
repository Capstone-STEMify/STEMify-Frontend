'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { ColumnDef } from '@tanstack/react-table'
import { useParams } from 'next/navigation'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import Image from 'next/image'
import { useDeleteEmulationFromCurriculumMutation } from '@/features/resource/curriculum/api/curriculumApi'
import { EmulatorWithThumbnail } from '@/features/emulator/types/emulator.type'

export function useGetEmulatorColumn(): ColumnDef<EmulatorWithThumbnail>[] {
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const tm = useTranslations('message')
  const { curriculumId } = useParams()
  const { openModal } = useModal()

  const [removeEmulatorFromCurriculum] = useDeleteEmulationFromCurriculumMutation()

  const handleRemoveEmulator = async (emulationIds: string[]) => {
    try {
      await removeEmulatorFromCurriculum({ curriculumId: Number(curriculumId!), emulationIds }).unwrap()
      toast.success(tt('successMessage.removeEmulatorFromCurriculum'))
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  return [
    createSelectColumn<EmulatorWithThumbnail>(),
    {
      accessorKey: 'name',
      header: tc('tableHeader.name'),
      enableSorting: true,
      cell: ({ row }) => row.original.name
    },
    {
      accessorKey: 'thumbnailUrl',
      header: () => <div>{tc('tableHeader.image')}</div>,
      cell: ({ row }) => {
        const src = row.original.thumbnailUrl
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
    createActionsColumnFromItems<EmulatorWithThumbnail>([
      {
        label: tc('button.remove'),
        danger: true,
        hidden: () => curriculumId === undefined,
        onClick: async ({ original }) => {
          // Open the confirmation modal for removing emulator from curriculum
          openModal('confirm', {
            message: tt('confirmMessage.removeEmulator', { title: original.name }),
            onConfirm: () => handleRemoveEmulator([original.emulationId])
          })
        }
      }
    ])
  ]
}
