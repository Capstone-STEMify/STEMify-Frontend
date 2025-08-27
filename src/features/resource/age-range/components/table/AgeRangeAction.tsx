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
  const t = useTranslations('tableHeader')

  const handleDelete = async (id: number) => {
    try {
      await deleteAgeRange(id).unwrap()
      toast.success(`Successfully deleted age range ${id}.`)
    } catch (error) {
      toast.error('Failed to delete age range.')
    }
  }

  return [
    createSelectColumn<AgeRange>(),
    {
      accessorKey: 'id',
      header: t('id')
    },
    {
      accessorKey: 'ageRangeLabel',
      header: t('ageRangeLabel')
    },
    {
      accessorKey: 'minAge',
      header: t('minAge')
    },
    {
      accessorKey: 'maxAge',
      header: t('maxAge')
    },
    createActionsColumnFromItems<AgeRange>([
      {
        label: t('edit'),
        onClick: ({ original }) => {
          openModal('upsertAgeRange', { id: original.id })
        }
      },
      {
        label: t('delete'),
        danger: true,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: `Are you sure you want to delete age range "${original.ageRangeLabel}"?`,
            onConfirm: () => handleDelete(original.id)
          })
        }
      }
    ])
  ]
}
