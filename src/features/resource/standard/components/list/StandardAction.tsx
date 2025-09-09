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
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const tm = useTranslations('message')

  const handleDelete = async (id: number) => {
    try {
      await deleteStandard(id).unwrap()
      toast.success(tt('successMessage.delete'))
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  return [
    createSelectColumn<Standard>(),
    {
      accessorKey: 'id',
      header: tc('tableHeader.id')
    },
    {
      accessorKey: 'standardName',
      header: tc('tableHeader.name')
    },
    {
      accessorKey: 'description',
      header: tc('tableHeader.description'),
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
        label: tc('button.update'),
        onClick: ({ original }) => {
          openModal('upsertStandard', { id: original.id })
        }
      },
      {
        label: tc('button.delete'),
        danger: true,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: tt('confirmMessage.delete', { title: original.standardName }),
            onConfirm: () => handleDelete(original.id)
          })
        }
      }
    ])
  ]
}
