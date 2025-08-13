'use client'
import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useGetAllCategoryQuery } from '@/features/resource/category/api/categoryApi'
import { useGetCategoryAction } from '@/features/resource/category/components/table/CategoryAction'
import { useModal } from '@/providers/ModalProvider' // Import useModal
import { Plus } from 'lucide-react'
import React from 'react'

export default function CategoryTable() {
  const { openModal } = useModal() // Get the openModal function
  const columns = useGetCategoryAction()
  const { data, isLoading } = useGetAllCategoryQuery() // Add isLoading for better UX

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  // Optional: Show a loading state
  if (isLoading) {
    return <div>Loading categories...</div>
  }

  if (!rows) {
    return <div>Nothing to display.</div>
  }

  const handleCreate = () => {
    openModal('upsertCategory')
  }

  return (
    <DataTable
      data={rows}
      columns={columns}
      filterColumnId='id'
      placeholder='Search by ID...'
      enableRowSelection
      toolbarRight={
        <Button size={'icon'} className='bg-amber-custom-400 rounded-full' onClick={handleCreate}>
          <Plus />
        </Button>
      }
    />
  )
}