'use client'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useGetOrganizationSubscriptionColumns } from '@/features/organization-package/components/list/OrganizationSubscriptionColumnTable'
import {
  BillingCycle,
  OrganizationSubscription,
  SubscriptionStatus
} from '@/features/organization-package/types/subscription.type'
import React from 'react'

export default function OrganizationSubscriptionHistory() {
  const columns = useGetOrganizationSubscriptionColumns()
  const data: OrganizationSubscription[] = [
    {
      id: 1,
      plan: 'STEMIFY Basic',
      status: SubscriptionStatus.ACTIVE,
      price: 120,
      totalCurriculums: 5,
      totalSeats: 500,
      StartDate: '2025-01-01',
      EndDate: '2026-01-01',
      billingCycle: BillingCycle.YEARLY
    },
    {
      id: 2,
      plan: 'STEMIFY Plus',
      status: SubscriptionStatus.EXPIRED,
      price: 200,
      totalCurriculums: 3,
      totalSeats: 200,
      StartDate: '2024-05-01',
      EndDate: '2024-11-01',
      billingCycle: BillingCycle.SEMIANNUAL
    },
    {
      id: 3,
      plan: 'STEMIFY Premium',
      status: SubscriptionStatus.EXPIRED,
      price: 350,
      totalCurriculums: 2,
      totalSeats: 100,
      StartDate: '2025-07-01',
      EndDate: '2025-12-31',
      billingCycle: BillingCycle.SEMIANNUAL
    }
  ]
  const rows = React.useMemo(() => data ?? [], [data])
  return (
    <div className='mx-auto flex max-w-6xl flex-col gap-6 p-4'>
      <DataTable columns={columns} data={rows} pagingData={data} enableRowSelection={false} />
    </div>
  )
}
