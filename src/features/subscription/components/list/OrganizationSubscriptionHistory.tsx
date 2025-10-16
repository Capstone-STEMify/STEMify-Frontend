'use client'
import { DataTable } from '@/components/shared/data-table/data-table'
import { BillingCycle } from '@/features/plan/types/plan.type'
import { useGetOrganizationSubscriptionColumns } from '@/features/subscription/components/list/OrganizationSubscriptionColumnTable'
import { OrganizationSubscription, SubscriptionStatus } from '@/features/subscription/types/subscription.type'
import { useTranslations } from 'next-intl'

import React from 'react'

export default function OrganizationSubscriptionHistory() {
  const t = useTranslations('subscription')
  const columns = useGetOrganizationSubscriptionColumns()
  const data: OrganizationSubscription[] = [
    {
      id: 1,
      plan: 'STEMIFY Basic',
      status: SubscriptionStatus.ACTIVE,
      pricePerSeat: 120,
      totalCurriculums: 5,
      totalUsers: 300,
      totalSeats: 500,
      startDate: '2025-01-01',
      endDate: '2026-01-01',
      billingCycle: BillingCycle.TWELVEMONTHS
    },
    {
      id: 2,
      plan: 'STEMIFY Plus',
      status: SubscriptionStatus.EXPIRED,
      pricePerSeat: 200,
      totalCurriculums: 3,
      totalSeats: 200,
      totalUsers: 150,
      startDate: '2024-05-01',
      endDate: '2024-11-01',
      billingCycle: BillingCycle.SIXMONTHS
    },
    {
      id: 3,
      plan: 'STEMIFY Premium',
      status: SubscriptionStatus.EXPIRED,
      pricePerSeat: 350,
      totalCurriculums: 2,
      totalSeats: 100,
      totalUsers: 50,
      startDate: '2025-07-01',
      endDate: '2025-12-31',
      billingCycle: BillingCycle.SIXMONTHS
    }
  ]
  const rows = React.useMemo(() => data ?? [], [data])
  return (
    <div className='mx-auto flex max-w-6xl flex-col gap-6 p-4'>
      <h1 className='mt-4 mb-4 text-3xl font-bold'>{t('list.subscriptionHistoryTitle')}</h1>
      <DataTable columns={columns} data={rows} pagingData={data} enableRowSelection={false} />
    </div>
  )
}
