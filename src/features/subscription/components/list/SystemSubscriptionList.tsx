'use client'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import SSelect from '@/components/shared/SSelect'
import { BillingCycle } from '@/features/plan/types/plan.type'
import { useGetOrganizationColumnTable } from '@/features/subscription/components/list/SystemSubscriptionColumnTable'
import {
  OrganizationStatus,
  OrganizationSubscription,
  SubscriptionStatus
} from '@/features/subscription/types/subscription.type'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function OrganizationList() {
  const t = useTranslations('Admin.placeholder')
  const tc = useTranslations('common')
  const tList = useTranslations('curriculum.list')

  const dispatch = useAppDispatch()
  const { openModal } = useModal()

  const columns = useGetOrganizationColumnTable()
  const data: OrganizationSubscription[] = [
    {
      id: 1,
      organizationId: 1,
      organizationName: 'Example Corp',
      organizationDescription: 'A sample organization',
      organizationImageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGXT3A_mrlYfgBBKN5Qh7yXzDjEIPT34SUPQ&s',
      organizationType: 'Technology',
      startDate: '2023-10-01',
      endDate: '2024-10-01',
      billingCycle: BillingCycle.TWELVEMONTHS,
      status: SubscriptionStatus.ACTIVE,
      totalCurriculums: 10,
      totalSeats: 100,
      totalUsers: 45,
      pricePerSeat: 999.99,
      organizationStatus: OrganizationStatus.ACTIVE,
      plan: 'Stemify Pro'
    },
    {
      id: 2,
      organizationId: 2,
      organizationName: 'Example Corp',
      organizationDescription: 'A sample organization',
      organizationImageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGXT3A_mrlYfgBBKN5Qh7yXzDjEIPT34SUPQ&s',
      organizationType: 'Technology',
      startDate: '2023-10-01',
      endDate: '2024-10-01',
      billingCycle: BillingCycle.TWELVEMONTHS,
      status: SubscriptionStatus.ACTIVE,
      totalCurriculums: 10,
      totalSeats: 100,
      totalUsers: 45,
      pricePerSeat: 999.99,
      organizationStatus: OrganizationStatus.ACTIVE,
      plan: 'Stemify Pro'
    }
  ]
  const rows = React.useMemo(() => data ?? [], [data])

  // Options for selects
  const statusOptions = Object.entries(OrganizationStatus).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
    value: value
  }))

  const handlePageChange = (page: number) => {
    // dispatch(setPageIndex(page))
  }

  return (
    <div className='mx-auto max-w-6xl p-4'>
      <div className='flex items-center gap-4 pt-4 pb-8'>
        <Input
          placeholder={t('userSearch')}
          //   value={searchQuery}
          //   onChange={(e) => setSearchQuery(e.target.value)}
          className='max-w-sm'
        />
        <SSelect
          className='w-30'
          placeholder={tList('placeholder.status')}
          //   value={filters.status?.toString() ?? ''}
          value={''}
          //   onChange={(val) => dispatch(setParam({ key: 'status', value: val as CurriculumStatus }))}
          onChange={(val) => {}}
          options={statusOptions}
          onOpen={() => {
            // No action needed; statusOptions is static
          }}
        />
        <Button className='bg-sky-500' onClick={() => openModal('upsertOrganization')}>
          + {tc('button.create')}
        </Button>
      </div>
      <DataTable
        data={rows}
        columns={columns}
        enableRowSelection
        pagingData={data}
        // pagingParams={queryParams}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}
