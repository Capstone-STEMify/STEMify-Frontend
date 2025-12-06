'use client'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useModal } from '@/providers/ModalProvider'
import React, { useState } from 'react'
import { useGetOrganizationUserQuery, useSearchUserQuery } from '../../api/userApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { UserSliceParams, UserStatus } from '../../types/user.type'
import { useTranslations } from 'next-intl'
import { setPageIndex, setParam } from '../../slice/userSlice'
import useDebounce from '@/hooks/useDebounce'
import { useSession } from 'next-auth/react'
import SSelect from '@/components/shared/SSelect'
import { UserRole } from '@/types/userRole'
import { useStatusTranslation } from '@/utils/index'
import { useGetOrganizationUserAction } from '@/features/user/components/table/UserOrganizationAction'
import { useParams } from 'next/navigation'

export default function UserOrganizationTable() {
  const t = useTranslations('Admin.placeholder')
  const to = useTranslations('organization.detail')
  const tCommon = useTranslations('common')
  const statusTranslate = useStatusTranslation()
  const { organizationId } = useParams()
  const columns = useGetOrganizationUserAction()
  const dispatch = useAppDispatch()

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const userParams = useAppSelector((state) => state.user)

  const searchParams: UserSliceParams = {
    ...userParams,
    search: debouncedSearchQuery,
    pageNumber: userParams.pageNumber ?? 0
  }

  const { data } = useGetOrganizationUserQuery(
    { organizationId: Number(organizationId), pageSize: 20 },
    { skip: !organizationId }
  )

  const rows = React.useMemo(
    () =>
      (data?.data.items ?? []).map((item, idx) => ({
        id: item.userId,
        ...item
      })),
    [data]
  )

  const userRoleOptions = Object.entries(UserRole)
    .filter(([key, _]) => key !== 'GUEST')
    .map(([key, value]) => ({
      label: tCommon(`accountType.${value.toLowerCase()}`),
      value: value
    }))

  const statusOptions = Object.entries(UserStatus).map(([key, value]) => ({
    label: statusTranslate(value),
    value: value
  }))

  const handlePageChange = (page: number) => {
    dispatch(setPageIndex(page))
  }

  return (
    <div>
      <h2 className='text-lg font-semibold'>{to('user.title')}</h2>
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
            placeholder={tCommon('accountType.accountTypeLabel')}
            value={userParams.role?.toString() ?? ''}
            onChange={(val) => dispatch(setParam({ key: 'role', value: val as UserRole }))}
            options={userRoleOptions}
          />
          <SSelect
            className='w-[150px]'
            placeholder={tCommon('status.statusLabel')}
            value={userParams.status?.toString() ?? ''}
            onChange={(val) => dispatch(setParam({ key: 'status', value: val as UserStatus }))}
            options={statusOptions.filter((option) => option.value !== UserStatus.DELETED)}
          />
        </div>
      </div>

      <DataTable
        data={rows}
        columns={columns as any}
        enableRowSelection={false}
        pagingData={data}
        pagingParams={userParams}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}
