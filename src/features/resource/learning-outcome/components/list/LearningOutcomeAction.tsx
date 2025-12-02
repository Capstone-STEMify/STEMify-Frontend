'use client'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { useDeleteLearningOutcomeMutation } from '../../api/learningOutcomeApi'
import { LearningOutcome } from '@/features/resource/learning-outcome/types/learningOutcome.type'
import { useAppSelector } from '@/hooks/redux-hooks'

export function useGetLearningOutcomeAction(): ColumnDef<LearningOutcome>[] {
  const { openModal } = useModal()
  const { selectedOrganizationId } = useAppSelector((state) => state.selectedOrganization)
  const [deleteLearningOutcome] = useDeleteLearningOutcomeMutation()
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const tm = useTranslations('message')

  const handleDelete = async (id: number) => {
    try {
      await deleteLearningOutcome(id).unwrap()
      toast.success(tt('successMessage.delete'))
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  const actionColumn = createActionsColumnFromItems<LearningOutcome>([
    {
      label: tc('button.update'),
      onClick: ({ original }) => {
        openModal('upsertLearningOutcome', { id: original.id })
      }
    },
    {
      label: tc('button.delete'),
      danger: true,
      onClick: async ({ original }) => {
        openModal('confirm', {
          message: tt('confirmMessage.delete', { title: original.name }),
          onConfirm: () => handleDelete(original.id)
        })
      }
    }
  ])

  return [
    createSelectColumn<LearningOutcome>(),
    {
      accessorKey: 'id',
      header: tc('tableHeader.id')
    },
    {
      accessorKey: 'name',
      header: tc('tableHeader.name')
    },
    {
      accessorKey: 'description',
      header: () => <div>{tc('tableHeader.description')}</div>,
      cell: ({ row }) => {
        return <div className='line-clamp-5 w-md whitespace-pre-wrap'>{row.getValue('description')}</div>
      }
    },
    ...(!selectedOrganizationId ? [actionColumn] : [])
  ]
}
