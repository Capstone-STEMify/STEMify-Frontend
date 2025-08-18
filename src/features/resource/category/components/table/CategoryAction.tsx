import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useDeleteCategoryMutation } from '@/features/resource/category/api/categoryApi' // Import delete mutation
import { Category } from '@/features/resource/category/types/category.type'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import z from 'zod'

export const categoryTableSchema = z.object({
  id: z.number(),
  categoryName: z.string(),
  slug: z.string()
})

export function useGetCategoryAction(): ColumnDef<Category>[] {
  const router = useRouter()
  const { openModal } = useModal()
  const [deleteCategory] = useDeleteCategoryMutation() // Hook for deletion

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap()
      toast.success(`Successfully deleted topic ${id}.`)
    } catch (error) {
      toast.error('Failed to delete topic.')
    }
  }

  return [
    createSelectColumn<Category>(),
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => row.getValue('id')
    },
    {
      accessorKey: 'categoryName',
      header: 'Name',
    },
    createActionsColumnFromItems<Category>([
      {
        label: 'Edit',
        onClick: ({ original }) => {
          // Open the upsert modal in "edit" mode
          openModal('upsertCategory', { id: original.id })
        }
      },
      {
        label: 'Delete',
        danger: true,
        onClick: async ({ original }) => {
          // Open the confirmation modal for deletion
          openModal('confirm', {
            message: `Are you sure you want to delete topic "${original.name}"?`,
            onConfirm: () => handleDelete(original.id)
          })
        }
      }
    ])
  ]
}
