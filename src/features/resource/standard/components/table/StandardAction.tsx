'use client'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useDeleteStandardMutation } from '@/features/resource/standard/api/standardApi'
import { Standard } from '@/features/resource/standard/types/standard.type'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

export function useGetStandardAction(): ColumnDef<Standard>[] {
  const { openModal } = useModal()
  const [deleteStandard] = useDeleteStandardMutation()

  const handleDelete = async (id: number) => {
    try {
      await deleteStandard(id).unwrap()
      toast.success(`Successfully deleted standard ${id}.`)
    } catch (error) {
      toast.error('Failed to delete standard.')
    }
  }

  return [
    createSelectColumn<Standard>(),
    {
      accessorKey: 'id',
      header: 'ID'
    },
    {
      accessorKey: 'standardName',
      header: 'Standard Name'
    },
    createActionsColumnFromItems<Standard>([
      {
        label: 'Edit',
        onClick: ({ original }) => {
          openModal('upsertStandard', { id: original.id })
        }
      },
      {
        label: 'Delete',
        danger: true,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: `Are you sure you want to delete standard "${original.standardName}"?`,
            onConfirm: () => handleDelete(original.id)
          })
        }
      }
    ])
  ]
}