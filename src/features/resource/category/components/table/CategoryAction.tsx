import { Badge } from '@/components/shadcn/badge'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { Category } from '@/features/resource/category/types/category.type'
import { useIsMobile } from '@/hooks/use-mobile'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import z from 'zod'

export const categoryTableschema = z.object({
  id: z.number(),
  categoryName: z.string(),
  slug: z.string()
})

export function useGetCategoryAction(): ColumnDef<Category>[] {
  const router = useRouter()
  const { openModal } = useModal()

  return [
    createSelectColumn<Category>(),
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => row.getValue('id')
    },
    {
      accessorKey: 'categoryName',
      header: () => <div className='text-center'>Name</div>,
      cell: ({ row }) => (
        <div className='cursor-pointer text-center font-bold underline' onClick={() => openModal('upsertCategory')}>
          {row.getValue('categoryName')}
        </div>
      )
    },
    createActionsColumnFromItems<Category>([
      {
        label: 'Copy Id',
        onClick: ({ original }) => {
          navigator.clipboard.writeText(original.id.toString())
        }
      },
      {
        label: 'View details',
        separatorBefore: true,
        onClick: ({ original }) => router.push(`/admin/category/${original.id}`)
      },
      {
        label: 'Edit',
        onClick: ({ original }) => router.push(`/admin/category/${original.id}/edit`)
      },
      {
        label: 'Delete',
        danger: true,
        onClick: async ({ original }) => {
          if (!confirm(`Delete category ${original.id}?`)) return
        }
      }
    ])
  ]
}
