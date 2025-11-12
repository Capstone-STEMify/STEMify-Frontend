'use client'
import SEmpty from '@/components/shared/empty/SEmpty'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useSearchPlanQuery } from '@/features/plan/api/planApi'
import { SubscriptionHeader } from '@/features/plan/components/header/SubscriptionHeader'
import { SubscriptionPlan } from '@/features/plan/components/list/SubscriptionPlan'
import { PlanStatus } from '@/features/plan/types/plan.type'
import { useAppSelector } from '@/hooks/redux-hooks'

export default function PlanList() {
  const { data: plansData, isLoading } = useSearchPlanQuery({
    pageNumber: 1,
    pageSize: 3,
    status: PlanStatus.PUBLISHED
  })
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
    <main className='flex min-h-screen flex-col bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 py-24'>
      <div className='mx-auto w-full max-w-6xl'>
        <div className='mb-16'>
          <SubscriptionHeader />
        </div>
        <SubscriptionPlan plans={plansData.data.items} />
      </div>
    </main>
  )
}
