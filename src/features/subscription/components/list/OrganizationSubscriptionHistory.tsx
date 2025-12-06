'use client'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SSelect from '@/components/shared/SSelect'
import { BillingCycle } from '@/features/plan/types/plan.type'
import { useSearchSubscriptionQuery } from '@/features/subscription/api/subscriptionApi'
import { useGetOrganizationSubscriptionColumns } from '@/features/subscription/components/list/OrganizationSubscriptionColumnTable'
import { resetParams, setPageIndex, setParam } from '@/features/subscription/slice/subscriptionSlice'
import { SubscriptionStatus } from '@/features/subscription/types/subscription.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useTranslations } from 'next-intl'

import React, { useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/shadcn/card'
import { BarChart2, CheckCircle2, Clock, TimerOff } from 'lucide-react'
import { useStatusTranslation } from '@/utils/index'

export default function OrganizationSubscriptionHistory() {
  const t = useTranslations('subscription.list')
  const params = useAppSelector((state) => state.organizationSubscription)
  const dispatch = useAppDispatch()
  const organizationId = useAppSelector((state) => state.selectedOrganization.selectedOrganizationId)
  const statusTranslations = useStatusTranslation()

  useEffect(() => {
    dispatch(resetParams())
  }, [dispatch])

  const { data: subscriptionData, isLoading } = useSearchSubscriptionQuery(
    { ...params, organizationId },
    { skip: !organizationId }
  )
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
    return { label: statusTranslations(key), value }
  })

  const billingCycleOptions = Object.entries(BillingCycle).map(([key, value]) => {
    let label = ''
    if (value === BillingCycle.ANNUAL) {
      label = t('annual')
    } else if (value === BillingCycle.SEMIANNUAL) {
      label = t('semiAnnual')
    }
    return { label, value }
  })

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  if (isLoading) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  return (
    <div className='mx-auto flex max-w-6xl flex-col gap-6 p-4'>
      <h1 className='mt-4 mb-6 text-3xl font-bold'>{t('subscriptionTitle')}</h1>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
        {/* Total */}
        <Card className='relative overflow-hidden rounded-xl border bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm transition hover:shadow-md'>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <p className='text-sm font-medium text-slate-600'>{t('total')}</p>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-200'>
                <BarChart2 className='h-5 w-5 text-slate-700' />
              </div>
            </div>
            <p className='text-4xl font-bold text-slate-900'>{subscriptionStats.total}</p>
            <p className='text-muted-foreground mt-1 text-xs'>{t('totalDescription')}</p>
          </CardContent>
        </Card>

        {/* Active */}
        <Card className='relative overflow-hidden rounded-xl border bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-sm transition hover:shadow-md'>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <p className='text-sm font-medium text-emerald-700'>{t('active')}</p>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200'>
                <CheckCircle2 className='h-5 w-5 text-emerald-700' />
              </div>
            </div>
            <p className='text-4xl font-bold text-emerald-700'>{subscriptionStats.active}</p>
            <p className='mt-1 text-xs text-emerald-700/70'>{t('activeDescription')}</p>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card className='relative overflow-hidden rounded-xl border bg-gradient-to-br from-amber-50 to-yellow-100 shadow-sm transition hover:shadow-md'>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <p className='text-sm font-medium text-amber-700'>{t('pending')}</p>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-200'>
                <Clock className='h-5 w-5 text-amber-700' />
              </div>
            </div>
            <p className='text-4xl font-bold text-amber-700'>{subscriptionStats.pending}</p>
            <p className='mt-1 text-xs text-amber-700/70'>{t('pendingDescription')}</p>
          </CardContent>
        </Card>

        {/* Expired */}
        <Card className='relative overflow-hidden rounded-xl border bg-gradient-to-br from-rose-50 to-rose-100 shadow-sm transition hover:shadow-md'>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <p className='text-sm font-medium text-rose-700'>{t('expired')}</p>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-rose-200'>
                <TimerOff className='h-5 w-5 text-rose-700' />
              </div>
            </div>
            <p className='text-4xl font-bold text-rose-700'>{subscriptionStats.expired}</p>
            <p className='mt-1 text-xs text-rose-700/70'>{t('expiredDescription')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
        {/* Search input */}
        <div className='flex-1 sm:max-w-md'>
          <Input
            placeholder={t('placeholder.search')}
            value={params.search ?? ''}
            onChange={(e) => dispatch(setParam({ key: 'search', value: e.target.value }))}
            className='w-full shadow-sm transition-colors focus:border-blue-500'
          />
        </div>

        {/* Filters */}
        <div className='flex gap-2'>
          <SSelect
            placeholder={t('placeholder.status')}
            value={params.status?.toString() ?? ''}
            onChange={(val) => dispatch(setParam({ key: 'status', value: val as SubscriptionStatus }))}
            options={statusOptions}
          />
          <SSelect
            placeholder={t('placeholder.billingCycle')}
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
        handlePageChange={handlePageChange}
      />
    </div>
  )
}
