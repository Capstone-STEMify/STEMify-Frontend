'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/redux-hooks'
import { useGetOrganizationUserQuery } from '@/features/user/api/userApi'
import { OrganizationUserQueryParams } from '@/features/user/types/user.type'
import { DataTable } from '@/components/shared/data-table/data-table'
import { setPageIndex } from '@/features/organization/slice/organizationSlice'
import { useOrganizationUserColumns, OrganizationUserTableItem } from './OrganizationUserColumns'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/shadcn/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Search } from 'lucide-react'
import { LicenseType } from '@/types/userRole'

// Hook debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
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

export default function OrganizationUserTable() {
  const t = useTranslations('organization.userTable')
  const dispatch = useAppDispatch()

  const organizationId = useAppSelector((state) => state.selectedOrganization.selectedOrganizationId) ?? 1
  const userParams = useAppSelector((state) => state.user)

  const [searchTerm, setSearchTerm] = useState('')

  const [selectedRole, setSelectedRole] = useState<LicenseType>(LicenseType.STUDENT)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const searchParams: OrganizationUserQueryParams = {
    organizationId,
    pageNumber: userParams.pageNumber ?? 1,
    pageSize: userParams.pageSize ?? 10,
    role: selectedRole,
    email: debouncedSearchTerm || undefined
  }

  const { data, isLoading } = useGetOrganizationUserQuery(searchParams, {
    skip: !organizationId
  })

  const columns = useOrganizationUserColumns()

  const visibleColumns = useMemo(() => {
    if (selectedRole !== LicenseType.STUDENT) {
      return columns.filter((col) => col.id !== 'groupName')
    }
    return columns
  }, [columns, selectedRole])

  const rows: OrganizationUserTableItem[] = useMemo(() => {
    if (!data?.data?.items) return []
    return data.data.items.map((user) => ({
      ...user,
      id: user.userId
    }))
  }, [data])

  const handlePageChange = (page: number) => {
    dispatch(setPageIndex(page))
  }

  return (
    <div className='mt-4 ml-4 w-full max-w-7xl'>
      {/* Header */}
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h1 className='mt-4 mb-4 text-3xl font-bold'>{t('title')}</h1>
          <p className='text-muted-foreground mt-1'>{t('description')}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className='mb-6 flex items-center gap-4'>
        {/* Search Input */}
        <div className='relative w-72'>
          <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
          <Input
            placeholder={t('placeholder.email')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-8'
          />
        </div>

        {/* Role Select */}
        <div className='w-[220px]'>
          <Select value={selectedRole} onValueChange={(val) => setSelectedRole(val as LicenseType)}>
            <SelectTrigger>
              <SelectValue placeholder={t('placeholder.license')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={LicenseType.STUDENT}>{t('student')}</SelectItem>
              <SelectItem value={LicenseType.TEACHER}>{t('teacher')}</SelectItem>
              <SelectItem value={LicenseType.ORGANIZATION_ADMIN}>{t('admin')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={visibleColumns}
        data={rows}
        pagingData={data}
        pagingParams={searchParams}
        handlePageChange={handlePageChange}
        placeholder={isLoading ? 'Đang tải dữ liệu...' : 'Không có người dùng nào khớp với bộ lọc'}
      />
    </div>
  )
}
