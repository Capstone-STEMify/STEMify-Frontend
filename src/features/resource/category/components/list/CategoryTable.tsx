'use client'
import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useSearchCategoryQuery } from '@/features/resource/category/api/categoryApi'
import { useModal } from '@/providers/ModalProvider'
import { Plus } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/shadcn/input'
import { useTranslations } from 'next-intl'
import { CategoryQueryParams } from '../../types/category.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setPageIndex, setSearchTerm } from '@/features/resource/category/slice/categorySlice'
import useDebounce from '@/hooks/useDebounce'
import { useGetCategoryAction } from '@/features/resource/category/components/list/CategoryAction'

export default function CategoryTable() {
  const t = useTranslations('Admin.placeholder')
  const { openModal } = useModal()
  const dispatch = useAppDispatch()
  const columns = useGetCategoryAction()

  const categoryParams = useAppSelector((state) => state.category)
  const debouncedSearchQuery = useDebounce(categoryParams.search, 500)

  const queryParams: CategoryQueryParams = {
    pageNumber: categoryParams.pageNumber,
    pageSize: categoryParams.pageSize,
    search: debouncedSearchQuery,
    status: categoryParams.status
  }

  const { data } = useSearchCategoryQuery(queryParams)

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handleCreate = () => {
    openModal('upsertCategory')
  }

  const handlePageChange = (page: number) => {
    dispatch(setPageIndex(page))
  }

  return (
    <div>
      <div className='flex items-center justify-between py-4'>
        <Input
          placeholder={t('topicSearch')}
          value={queryParams.search}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          className='max-w-sm'
        />
        <Button size={'icon'} className='bg-amber-custom-400 rounded-full' onClick={handleCreate}>
          <Plus />
        </Button>
      </div>
      <DataTable
        data={rows}
        columns={columns}
        enableRowSelection
        pagingData={data}
        pagingParams={queryParams}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}
