import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'
import { useDeleteCategoryMutation } from '@/features/resource/category/api/categoryApi' // Import delete mutation
import { Category } from '@/features/resource/category/types/category.type'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import z from 'zod'
import { use } from 'matter'

export const categoryTableSchema = z.object({
  id: z.number(),
  categoryName: z.string(),
  slug: z.string()
})

export function useGetCategoryAction(): ColumnDef<Category>[] {
  const router = useRouter()
  const { openModal } = useModal()
  const [deleteCategory] = useDeleteCategoryMutation() // Hook for deletion
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const tm = useTranslations('message')

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap()
      toast.success(tt('successMessage.delete'))
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  return [
    createSelectColumn<Category>(),
    {
      accessorKey: 'id',
      header: tc('tableHeader.id'),
      cell: ({ row }) => row.getValue('id')
    },
    {
      accessorKey: 'name',
      header: tc('tableHeader.name')
    },
    createActionsColumnFromItems<Category>([
      {
        label: tc('button.update'),
        onClick: ({ original }) => {
          // Open the upsert modal in "edit" mode
          openModal('upsertCategory', { id: original.id })
        }
      },
      {
        label: tc('button.delete'),
        danger: true,
        onClick: async ({ original }) => {
          // Open the confirmation modal for deletion
          openModal('confirm', {
            message: `${tt('confirmMessage.delete', { title: original.name })}`,
            onConfirm: () => handleDelete(original.id)
          })
        }
      }
    ])
  ]
}
