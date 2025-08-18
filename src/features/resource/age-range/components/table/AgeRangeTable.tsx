'use client'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useSearchAgeRangeQuery } from '@/features/resource/age-range/api/ageRangeApi'
import { useGetAgeRangeAction } from '@/features/resource/age-range/components/table/AgeRangeAction'
import { useModal } from '@/providers/ModalProvider'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState, useEffect } from 'react'
import { AgeRangeQueryParams } from '../../types/ageRange.type'
import { useAppSelector } from '@/hooks/redux-hooks'

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

export default function AgeRangeTable() {
  const { openModal } = useModal()
  const columns = useGetAgeRangeAction()

  const t = useTranslations('Admin.placeholder')

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const ageRangeParams = useAppSelector((state) => state.ageRange)

  const queryParams: AgeRangeQueryParams = {
    pageNumber: ageRangeParams.pageNumber,
    pageSize: ageRangeParams.pageSize,
    search: ageRangeParams.search,
    status: ageRangeParams.status
  }

  const { data, isLoading } = useSearchAgeRangeQuery({
    search: debouncedSearchQuery
  })

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handleCreate = () => {
    openModal('upsertAgeRange')
  }

  return (
    <div>
      <div className='flex items-center justify-between py-4'>
        <Input
          placeholder={t('ageRangeSearch')}
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
