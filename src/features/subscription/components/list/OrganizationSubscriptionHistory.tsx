'use client'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SSelect from '@/components/shared/SSelect'
import { BillingCycle } from '@/features/plan/types/plan.type'
import { useSearchSubscriptionQuery } from '@/features/subscription/api/subscriptionApi'
import { useGetOrganizationSubscriptionColumns } from '@/features/subscription/components/list/OrganizationSubscriptionColumnTable'
import { setParam } from '@/features/subscription/slice/subscriptionSlice'
import { OrganizationSubscription, SubscriptionStatus } from '@/features/subscription/types/subscription.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useTranslations } from 'next-intl'

import React, { useMemo } from 'react'
import { Card, CardAction, CardContent } from '@/components/shadcn/card'

export default function OrganizationSubscriptionHistory() {
  const t = useTranslations('subscription')
  const params = useAppSelector((state) => state.organizationSubscription)
  const dispatch = useAppDispatch()

  const { data: subscriptionData, isLoading } = useSearchSubscriptionQuery(params)
  const rows = React.useMemo(() => subscriptionData?.data.items ?? [], [subscriptionData])
  const columns = useGetOrganizationSubscriptionColumns()

  const subscriptionStats = useMemo(() => {
    const items = subscriptionData?.data.items ?? []

    return {
      total: items.length,
      active: items.filter((s) => s.status === SubscriptionStatus.ACTIVE).length,
      expired: items.filter((s) => s.status === SubscriptionStatus.EXPIRED).length,
      pending: items.filter((s) => s.status === SubscriptionStatus.PENDING).length
    }
  }, [subscriptionData])

  const statusOptions = Object.entries(SubscriptionStatus).map(([key, value]) => {
    const label = key
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    return { label, value }
  })

  const billingCycleOptions = Object.entries(BillingCycle).map(([key, value]) => {
    const label = key
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    return { label, value }
  })

  if (isLoading) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  return (
    <div className='mx-auto flex max-w-6xl flex-col gap-6 p-4'>
      <h1 className='mt-4 mb-6 text-3xl font-bold'>{t('list.subscriptionTitle')}</h1>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
        <Card className='overflow-hidden shadow-sm'>
          <CardContent className='p-6'>
            <div className='mb-3 flex items-center justify-between'>
              <p className='text-muted-foreground text-sm font-medium tracking-wide uppercase'>Total</p>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-100'>
                <svg className='h-5 w-5 text-slate-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
              </div>
            </div>
            <p className='text-4xl font-bold text-slate-900'>{subscriptionStats.total}</p>
          </CardContent>
        </Card>

        <Card className='relative overflow-hidden shadow-sm'>
          <CardContent className='relative z-10 p-6'>
            <div className='mb-3 flex items-center justify-between'>
              <p className='text-muted-foreground text-sm font-medium tracking-wide uppercase'>Active</p>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                <svg className='h-5 w-5 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
            </div>
            <p className='text-4xl font-bold text-green-600'>{subscriptionStats.active}</p>
          </CardContent>
        </Card>

        <Card className='relative overflow-hidden shadow-sm'>
          <CardContent className='relative z-10 p-6'>
            <div className='mb-3 flex items-center justify-between'>
              <p className='text-muted-foreground text-sm font-medium tracking-wide uppercase'>Pending</p>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100'>
                <svg className='h-5 w-5 text-yellow-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
            </div>
            <p className='text-4xl font-bold text-yellow-600'>{subscriptionStats.pending}</p>
          </CardContent>
        </Card>

        <Card className='relative overflow-hidden shadow-sm'>
          <CardContent className='relative z-10 p-6'>
            <div className='mb-3 flex items-center justify-between'>
              <p className='text-muted-foreground text-sm font-medium tracking-wide uppercase'>Expired</p>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100'>
                <svg className='h-5 w-5 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </div>
            </div>
            <p className='text-4xl font-bold text-red-600'>{subscriptionStats.expired}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
        {/* Search input */}
        <div className='flex-1 sm:max-w-md'>
          <Input
            placeholder='Search subscriptions...'
            value={params.search ?? ''}
            onChange={(e) => dispatch(setParam({ key: 'search', value: e.target.value }))}
            className='w-full shadow-sm transition-colors focus:border-blue-500'
          />
        </div>

        {/* Filters */}
        <div className='flex gap-2'>
          <SSelect
            placeholder='status'
            value={params.status?.toString() ?? ''}
            onChange={(val) => dispatch(setParam({ key: 'status', value: val as SubscriptionStatus }))}
            options={statusOptions}
          />
          <SSelect
            placeholder='billing cycle'
            value={params.billingCycle?.toString() ?? ''}
            onChange={(val) => dispatch(setParam({ key: 'billingCycle', value: val as BillingCycle }))}
            options={billingCycleOptions}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        pagingParams={params}
        pagingData={subscriptionData}
        enableRowSelection={false}
      />
    </div>
  )
}
