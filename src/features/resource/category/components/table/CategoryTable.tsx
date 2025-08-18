'use client'
import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useSearchCategoryQuery } from '@/features/resource/category/api/categoryApi'
import { useGetCategoryAction } from '@/features/resource/category/components/table/CategoryAction'
import { useModal } from '@/providers/ModalProvider'
import { Plus } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/shadcn/input'
import { useTranslations } from 'next-intl'
import { CategoryQueryParams } from '../../types/category.type'
import { useAppSelector } from '@/hooks/redux-hooks'

// Debounce hook to delay API calls
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

export default function CategoryTable() {
  const { openModal } = useModal()
  const columns = useGetCategoryAction()

  const t = useTranslations('Admin.placeholder')

  const [searchQuery, setSearchQuery] = useState('')
  // Debounce the search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const categoryParams = useAppSelector((state) => state.category)

  const queryParams: CategoryQueryParams = {
    pageNumber: categoryParams.pageNumber,
    pageSize: categoryParams.pageSize,
    search: categoryParams.search,
    status: categoryParams.status
  }

  const { data } = useSearchCategoryQuery({
    search: debouncedSearchQuery
  })

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handleCreate = () => {
    openModal('upsertCategory')
  }

  return (
    <div>
      <div className='flex items-center justify-between py-4'>
        <Input
          placeholder={t('topicSearch')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='max-w-sm'
        />
        <Button size={'icon'} className='bg-amber-custom-400 rounded-full' onClick={handleCreate}>
          <Plus />
        </Button>
      </div>
      <DataTable data={rows} columns={columns} enableRowSelection pagingData={data} pagingParams={queryParams} />
    </div>
  )
}
