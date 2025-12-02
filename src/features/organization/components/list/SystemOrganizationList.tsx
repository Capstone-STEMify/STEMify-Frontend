'use client'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SSelect from '@/components/shared/SSelect'
import { useSearchOrganizationsQuery } from '@/features/organization/api/organizationApi'
import { useGetOrganizationColumn } from '@/features/organization/components/list/SystemOrganizationColumn'
import { setPageIndex, setParam } from '@/features/organization/slice/organizationSlice'
import { OrganizationStatus } from '@/features/organization/types/organization.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { useStatusTranslation } from '@/utils/index'
import { Building2, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

export default function SystemOrganizationList() {
  const t = useTranslations('subscription')
  const tc = useTranslations('common')
  const { openModal } = useModal()
  const translateStatus = useStatusTranslation()

  const [search, setSearch] = useState<string>('')

  const dispatch = useAppDispatch()
  const queryParams = useAppSelector((state) => state.organization)

  const columns = useGetOrganizationColumn()
  const { data, isLoading } = useSearchOrganizationsQuery(queryParams)

  const organizationStatusOptions = [
    { label: tc('status.all'), value: 'all' },
    ...Object.entries(OrganizationStatus).map(([key, value]) => ({
      label: translateStatus(key),
      value
    }))
  ]

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handlePageChange = (page: number) => {
    dispatch(setPageIndex(page))
  }
  if (isLoading) {
    return (
      <div className='flex items-center justify-center'>
        <LoadingComponent />
      </div>
    )
  }

  return (
    <div className='my-5 px-10'>
      <div className='mx-auto max-w-7xl space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='mt-4 mb-4 text-3xl font-bold'>{t('list.organizationSubscriptionTitle')}</h1>
            <p className='text-muted-foreground mt-1'>{t('list.organizationSubscriptionDescription')}</p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => openModal('upsertOrganization')}>
              <Building2 className='h-4 w-4' /> {tc('button.createOrganization')}
            </Button>
          </div>
        </div>

        <div className='flex items-center justify-start gap-2'>
          {/* Search Input */}
          <div className='relative w-100'>
            <Input
              type='text'
              placeholder={t('list.placeholder.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='border-gray-300 bg-white pl-10 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            />
            <Search className='absolute top-3 left-3 h-4 w-4 text-gray-400' />
          </div>
          <SSelect
            className='w-fit'
            placeholder={t('list.placeholder.status')}
            value={queryParams.status?.toString() ?? ''}
            onChange={(val) => {
              if (val === 'all') {
                dispatch(setParam({ key: 'status', value: undefined }))
              } else {
                dispatch(setParam({ key: 'status', value: val as OrganizationStatus }))
              }
            }}
            options={organizationStatusOptions}
          />
        </div>

        <DataTable
          columns={columns}
          data={rows}
          pagingData={data}
          pagingParams={queryParams}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
