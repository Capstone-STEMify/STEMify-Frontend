'use client'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { useDeleteLearningOutcomeMutation } from '../../api/learningOutcomeApi'
import { LearningOutcome } from '../../types/learningOutcome.type'

export function useGetLearningOutcomeAction(): ColumnDef<LearningOutcome>[] {
  const { openModal } = useModal()
  const [deleteLearningOutcome] = useDeleteLearningOutcomeMutation()
  const t = useTranslations('tableHeader')

  const handleDelete = async (id: number) => {
    try {
      await deleteLearningOutcome(id).unwrap()
      toast.success(`Successfully deleted learning outcome ${id}.`)
    } catch (error) {
      toast.error('Failed to delete learning outcome.')
    }
  }

  return [
    createSelectColumn<LearningOutcome>(),
    {
      accessorKey: 'id',
      header: t('id')
    },
    {
      accessorKey: 'name',
      header: t('name')
    },
    createActionsColumnFromItems<LearningOutcome>([
      {
        label: t('edit'),
        onClick: ({ original }) => {
          openModal('upsertLearningOutcome', { id: original.id })
        }
      },
      {
        label: t('delete'),
        danger: true,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: `Are you sure you want to delete learning outcome "${original.name}"?`,
            onConfirm: () => handleDelete(original.id)
          })
        }
      }
    ])
  ]
}
