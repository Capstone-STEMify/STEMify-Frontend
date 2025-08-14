'use client'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useDeleteAgeRangeMutation } from '@/features/resource/age-range/api/ageRangeApi'
import { AgeRange } from '@/features/resource/age-range/types/ageRange.type'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

export function useGetAgeRangeAction(): ColumnDef<AgeRange>[] {
  const { openModal } = useModal()
  const [deleteAgeRange] = useDeleteAgeRangeMutation()

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
      header: 'ID'
    },
    {
      accessorKey: 'ageRangeLabel',
      header: 'Label'
    },
    {
      accessorKey: 'minAge',
      header: 'Min Age'
    },
    {
      accessorKey: 'maxAge',
      header: 'Max Age'
    },
    createActionsColumnFromItems<AgeRange>([
      {
        label: 'Edit',
        onClick: ({ original }) => {
          openModal('upsertAgeRange', { id: original.id })
        }
      },
      {
        label: 'Delete',
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
