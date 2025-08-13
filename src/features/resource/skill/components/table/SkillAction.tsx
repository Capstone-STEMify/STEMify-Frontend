'use client'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useDeleteSkillMutation } from '@/features/resource/skill/api/skillApi'
import { Skill } from '@/features/resource/skill/types/skill.type'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

export function useGetSkillAction(): ColumnDef<Skill>[] {
  const { openModal } = useModal()
  const [deleteSkill] = useDeleteSkillMutation()

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
      header: 'ID'
    },
    {
      accessorKey: 'skillName',
      header: 'Skill Name'
    },
    createActionsColumnFromItems<Skill>([
      {
        label: 'Edit',
        onClick: ({ original }) => {
          openModal('upsertSkill', { id: original.id })
        }
      },
      {
        label: 'Delete',
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
