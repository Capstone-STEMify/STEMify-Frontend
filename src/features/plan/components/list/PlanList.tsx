'use client'
import SEmpty from '@/components/shared/empty/SEmpty'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useSearchPlanQuery } from '@/features/plan/api/planApi'
import { SubscriptionHeader } from '@/features/plan/components/header/SubscriptionHeader'
import { PricingPlans } from '@/features/plan/components/list/SubscriptionPlan'

export default function PlanList() {
  const { data: plansData, isLoading } = useSearchPlanQuery({ pageNumber: 1, pageSize: 3 })
  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <LoadingComponent />
      </div>
    )
  }
  if (!plansData) {
    return <SEmpty title='No Plans Available' description='Please check back later.' />
  }
  return (
    <main className='flex min-h-screen flex-col bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 py-15'>
      <div className='mx-auto w-full max-w-6xl'>
        <div className='mb-16'>
          <SubscriptionHeader />
        </div>
        <PricingPlans plans={plansData.data.items} />
      </div>
    </main>
  )
}
