'use client'

import React, { useMemo } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/redux-hooks'
import { useGetOrganizationUserQuery } from '@/features/user/api/userApi'
import { OrganizationUserQueryParams } from '@/features/user/types/user.type'
import { DataTable } from '@/components/shared/data-table/data-table'
import { setPageIndex, setParam } from '@/features/organization/slice/organizationSlice'
import { useOrganizationUserColumns, OrganizationUserTableItem } from './OrganizationUserColumns'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/shadcn/button'
import { Building2 } from 'lucide-react'

export default function OrganizationUserTable() {
  const t = useTranslations('subscription')
  const tc = useTranslations('common')
  const dispatch = useAppDispatch()
  
  const organizationId = useAppSelector((state) => state.selectedOrganization.selectedOrganizationId) ?? 1
  const userParams = useAppSelector((state) => state.user)

  const searchParams: OrganizationUserQueryParams = {
    organizationId,
    pageNumber: userParams.pageNumber ?? 1,
    pageSize: userParams.pageSize ?? 10
  }

  const { data, isLoading } = useGetOrganizationUserQuery(searchParams, { 
    skip: !organizationId 
  })

  const columns = useOrganizationUserColumns()

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
    <div className="w-full max-w-7xl ml-4 mt-4">
      <div className='flex items-center justify-between mb-4'>
                <div>
                  <h1 className='mt-4 mb-4 text-3xl font-bold'>Quản lý người dùng trong Tổ chức</h1>
                  <p className='text-muted-foreground mt-1'>Duyệt và quản lý tất cả các thành viên tổ chức đã đăng ký trên nền tảng.</p>
                </div>
              </div>

      <DataTable
        columns={columns}
        data={rows}
        pagingData={data}
        pagingParams={searchParams}
        handlePageChange={handlePageChange}
        placeholder={isLoading ? "Đang tải dữ liệu..." : "Không có người dùng nào"}
      />
    </div>
  )
}