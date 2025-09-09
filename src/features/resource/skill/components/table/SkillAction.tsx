'use client'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'
import { useDeleteSkillMutation } from '@/features/resource/skill/api/skillApi'
import { Skill } from '@/features/resource/skill/types/skill.type'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

export function useGetSkillAction(): ColumnDef<Skill>[] {
  const { openModal } = useModal()
  const [deleteSkill] = useDeleteSkillMutation()
  const t = useTranslations('tableHeader')

  const handleDelete = async (id: number) => {
    try {
      await deleteSkill(id).unwrap()
      toast.success(`Successfully deleted skill ${id}.`)
    } catch (error) {
      toast.error('Failed to delete skill.')
    }
  }

  return [
    createSelectColumn<Skill>(),
    {
      accessorKey: 'id',
      header: t('id')
    },
    {
      accessorKey: 'skillName',
      header: t('skillName')
    },
    createActionsColumnFromItems<Skill>([
      {
        label: t('edit'),
        onClick: ({ original }) => {
          openModal('upsertSkill', { id: original.id })
        }
      },
      {
        label: t('delete'),
        danger: true,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: `Are you sure you want to delete skill "${original.skillName}"?`,
            onConfirm: () => handleDelete(original.id)
          })
        }
      }
    ])
  ]
}
