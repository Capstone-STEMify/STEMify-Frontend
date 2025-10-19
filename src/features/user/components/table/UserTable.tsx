'use client'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { useModal } from '@/providers/ModalProvider'
import { Plus } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useGetUserAction } from './UserAction'
import { useSearchUserQuery } from '../../api/userApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { UserQueryParams } from '../../types/user.type'
import { useTranslations } from 'next-intl'
import { setPageIndex } from '../../slice/userSlice'
import useDebounce from '@/hooks/useDebounce'
import { useSession } from 'next-auth/react'
import { DataTable } from '@/components/shared/data-table/data-table'

export default function UserTable() {
  const t = useTranslations('Admin.placeholder')
  const { openModal } = useModal()
  const columns = useGetUserAction()
  const dispatch = useAppDispatch()
  const { status } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const userParams = useAppSelector((state) => state.user)

  const queryParams: UserQueryParams = {
    pageNumber: userParams.pageNumber,
    pageSize: userParams.pageSize,
    search: debouncedSearchQuery,
    status: userParams.status
  }

  const { data } = useSearchUserQuery(queryParams, { skip: status !== 'authenticated' })

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
      <DataTable
        data={rows.map((u) => ({ ...u, id: u.userId }))}
        columns={columns as any}
        enableRowSelection
        pagingData={data}
        pagingParams={queryParams}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}
