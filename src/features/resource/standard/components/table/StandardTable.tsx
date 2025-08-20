'use client'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useSearchStandardQuery } from '@/features/resource/standard/api/standardApi'
import { useGetStandardAction } from '@/features/resource/standard/components/table/StandardAction'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState, useEffect } from 'react'
import { StandardQueryParams } from '../../types/standard.type'
import { setPageIndex } from '@/features/resource/standard/slice/standardSlice'

// Debounce hook để trì hoãn việc gọi API
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

export default function StandardTable() {
  const { openModal } = useModal()
  const columns = useGetStandardAction()
  const dispatch = useAppDispatch()

  const t = useTranslations('Admin.placeholder')

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const standardParams = useAppSelector((state) => state.standard)

  const queryParams: StandardQueryParams = {
    pageNumber: standardParams.pageNumber,
    pageSize: standardParams.pageSize,
    search: standardParams.search,
    status: standardParams.status
  }

  const { data, isLoading } = useSearchStandardQuery({
    search: debouncedSearchQuery
  })

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handleCreate = () => {
    openModal('upsertStandard')
  }

  const handlePageChange = (page: number) => {
    dispatch(setPageIndex(page))
  }

  return (
    <div>
      <div className='flex items-center justify-between py-4'>
        <Input
          placeholder={t('standardSearch')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
