import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { Category } from '@/features/resource/category/types/category.type'
import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'

export function useGetCategoryAction(): ColumnDef<Category>[] {
  const router = useRouter()
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
      cell: ({ row }) => <div className='text-center'>{row.getValue('categoryName')}</div>
    },
    {
      accessorKey: 'slug',
      header: () => <div className='text-right'>Slug</div>,
      cell: ({ row }) => <div className='text-right'>{row.getValue('slug')}</div>
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
        onClick: ({ original }) => router.push(`/admin/membership/${original.id}`)
      },
      {
        label: 'Edit',
        onClick: ({ original }) => router.push(`/admin/membership/${original.id}/edit`)
      },
      {
        label: 'Delete',
        danger: true,
        onClick: async ({ original }) => {
          if (!confirm(`Delete membership ${original.id}?`)) return
        }
      }
    ])
  ]
}
