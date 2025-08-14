'use client'
import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useGetAllCategoryQuery } from '@/features/resource/category/api/categoryApi'
import { useGetCategoryAction } from '@/features/resource/category/components/table/CategoryAction'
import { Plus } from 'lucide-react'
import React from 'react'

export default function CategoryTable() {
  const columns = useGetCategoryAction()
  const { data } = useGetAllCategoryQuery()

  const rows = React.useMemo(() => data?.data.items ?? [], [data])
  if (!rows) {
    return <div>Nothing</div>
  }
  return (
    <DataTable
      data={rows}
      columns={columns}
      filterColumnId='id'
      placeholder='Search...'
      enableRowSelection
      toolbarRight={
        <Button size={'icon'} className='bg-amber-custom-400 rounded-full'>
          <Plus />
        </Button>
      }
    />
  )
}
