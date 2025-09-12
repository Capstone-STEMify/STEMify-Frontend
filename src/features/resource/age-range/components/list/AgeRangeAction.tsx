'use client'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'
import { useDeleteAgeRangeMutation } from '@/features/resource/age-range/api/ageRangeApi'
import { AgeRange } from '@/features/resource/age-range/types/ageRange.type'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

export function useGetAgeRangeAction(): ColumnDef<AgeRange>[] {
  const { openModal } = useModal()
  const [deleteAgeRange] = useDeleteAgeRangeMutation()
  const tm = useTranslations('message')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  const handleDelete = async (id: number) => {
    try {
      await deleteAgeRange(id).unwrap()
      toast.success(`${tt('successMessage.delete', { title: id || '' })}`)
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  return [
    createSelectColumn<AgeRange>(),
    {
      accessorKey: 'id',
      header: tc('tableHeader.id')
    },
    {
      accessorKey: 'ageRangeLabel',
      header: tc('tableHeader.ageRangeLabel')
    },
    {
      accessorKey: 'minAge',
      header: tc('tableHeader.minAge')
    },
    {
      accessorKey: 'maxAge',
      header: tc('tableHeader.maxAge')
    },
    createActionsColumnFromItems<AgeRange>([
      {
        label: tc('button.update'),
        onClick: ({ original }) => {
          openModal('upsertAgeRange', { id: original.id })
        }
      },
      {
        label: tc('button.delete'),
        danger: true,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: `${tt('confirmMessage.delete', { title: original.ageRangeLabel })}`,
            onConfirm: () => handleDelete(original.id)
          })
        }
      }
    ])
  ]
}
