'use client'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useModal } from '@/providers/ModalProvider'
import { Plus, UserPlus } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useGetUserAction } from './UserAction'
import { useSearchUserQuery } from '../../api/userApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { User, UserQueryParams, UserStatus } from '../../types/user.type'
import { useTranslations } from 'next-intl'
import { setPageIndex, setParam } from '../../slice/userSlice'
import useDebounce from '@/hooks/useDebounce'
import { useSession } from 'next-auth/react'
import SSelect from '@/components/shared/SSelect'
import { UserRole } from '@/types/userRole'

export default function UserTable() {
  const t = useTranslations('Admin.placeholder')
  const { openModal } = useModal()
  const columns = useGetUserAction()
  const dispatch = useAppDispatch()
  const { status, data: session } = useSession()
  console.log('UserTable session', session)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const userParams = useAppSelector((state) => state.user)

  const { data } = useSearchUserQuery(userParams, { skip: status !== 'authenticated' })

  const rows = React.useMemo(
    () =>
      (data?.data.items ?? []).map((item, idx) => ({
        id: item.userId,
        ...item
      })),
    [data]
  )

  const userRoleOptions = Object.entries(UserRole).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
    value: value
  }))
  const statusOptions = Object.entries(UserStatus).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
    value: value
  }))

  const handleCreate = () => {
    openModal('upsertUser')
  }

  const handlePageChange = (page: number) => {
    dispatch(setPageIndex(page))
  }

  return (
    <div className='px-6'>
      <h1 className='text-2xl text-gray-800'>User Management</h1>
      <div className='flex justify-between'>
        <div className='flex items-center justify-start gap-4 py-4'>
          <Input
            placeholder={t('userSearch')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-[400px]'
          />
          <SSelect
            className='w-[150px]'
            placeholder='Account type'
            value={userParams.role?.toString() ?? ''}
            onChange={(val) => dispatch(setParam({ key: 'role', value: val as UserRole }))}
            options={userRoleOptions}
          />
          <SSelect
            className='w-[150px]'
            placeholder='Status'
            value={userParams.status?.toString() ?? ''}
            onChange={(val) => dispatch(setParam({ key: 'status', value: val as UserStatus }))}
            options={statusOptions}
          />
        </div>
        <Button className='bg-sky-500' onClick={handleCreate}>
          <UserPlus className='mr-2 h-4 w-4' />
          Create User
        </Button>
      </div>

      <DataTable
        data={rows}
        columns={columns as any}
        enableRowSelection
        pagingData={data}
        pagingParams={userParams}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}
