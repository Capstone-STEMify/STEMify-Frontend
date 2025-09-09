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
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const tm = useTranslations('message')

  const handleDelete = async (id: number) => {
    try {
      await deleteSkill(id).unwrap()
      toast.success(tt('successMessage.delete'))
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  return [
    createSelectColumn<Skill>(),
    {
      accessorKey: 'id',
      header: tc('tableHeader.id')
    },
    {
      accessorKey: 'skillName',
      header: tc('tableHeader.name')
    },
    createActionsColumnFromItems<Skill>([
      {
        label: tc('button.update'),
        onClick: ({ original }) => {
          openModal('upsertSkill', { id: original.id })
        }
      },
      {
        label: tc('button.delete'),
        danger: true,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: tt('confirmMessage.delete', { title: original.skillName }),
            onConfirm: () => handleDelete(original.id)
          })
        }
      }
    ])
  ]
}
