'use client'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'
import { useDeleteStandardMutation } from '@/features/resource/standard/api/standardApi'
import { Standard } from '@/features/resource/standard/types/standard.type'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

export function useGetStandardAction(): ColumnDef<Standard>[] {
  const { openModal } = useModal()
  const [deleteStandard] = useDeleteStandardMutation()
  const t = useTranslations('tableHeader')

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
      header: t('id')
    },
    {
      accessorKey: 'standardName',
      header: t('standardName')
    },
    {
      accessorKey: 'description',
      header: t('description'),
      cell: ({ row }) => {
        return (
          <div className='w-180 truncate' title={String(row.getValue('description'))}>
            {row.getValue('description')}
          </div>
        )
      }
    },
    createActionsColumnFromItems<Standard>([
      {
        label: t('edit'),
        onClick: ({ original }) => {
          openModal('upsertStandard', { id: original.id })
        }
      },
      {
        label: t('delete'),
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
