'use client'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useModal } from '@/providers/ModalProvider'
import { Plus } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useGetUserAction } from './UserAction'
import { useSearchUserQuery } from '../../api/userApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { UserQueryParams } from '../../types/user.type'
import { use } from 'matter'
import { useTranslations } from 'next-intl'
import { setPageIndex } from '../../slice/userSlice'

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

export default function UserTable() {
  const t = useTranslations('Admin.placeholder')
  const { openModal } = useModal()
  const columns = useGetUserAction()
   const dispatch = useAppDispatch()

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const userParams = useAppSelector((state) => state.user)

  const queryParams: UserQueryParams = {
      pageNumber: userParams.pageNumber,
      pageSize: userParams.pageSize,
      search: userParams.search,
      status: userParams.status
  }

  const { data, isLoading } = useSearchUserQuery({
    search: debouncedSearchQuery
  })

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handleCreate = () => {
    openModal('upsertUser')
  }

  const handlePageChange = (page: number) => {
      dispatch(setPageIndex(page))
  }

  return (
    <div>
      <div className='flex items-center justify-between py-4'>
        <Input
          placeholder={t('userSearch')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='max-w-sm'
        />
        <Button size={'icon'} className='bg-amber-custom-400 rounded-full' onClick={handleCreate}>
          <Plus />
        </Button>
      </div>
      <DataTable data={rows} columns={columns} enableRowSelection pagingData={data} pagingParams={queryParams} handlePageChange={handlePageChange}/>
    </div>
  )
}
