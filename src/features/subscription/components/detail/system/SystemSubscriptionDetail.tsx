'use client'

import { Button } from '@/components/shadcn/button'
import OrganizationInfo from '@/features/subscription/components/detail/system/OrganizationInfo'
import OrganizationAdmins from '@/features/subscription/components/detail/system/OrganizationAdmins'
import { useGetSubscriptionByIdQuery } from '@/features/subscription/api/subscriptionApi'
import { useParams } from 'next/navigation'
import ContractInfo from '@/features/subscription/components/detail/system/ContractInfo'
import SubscriptionInfo from '@/features/subscription/components/detail/system/SubscriptionInfo'

export default function SystemSubscriptionDetail() {
  const { subscriptionId } = useParams()
  const { data } = useGetSubscriptionByIdQuery(Number(subscriptionId))
  const subscription = data?.data

  if (!subscription) {
    return <div>Loading...</div>
  }
  return (
    <div className='bg-muted/30 min-h-screen p-6'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Organization Details</h1>
          <Button variant='outline'>Change plan</Button>
        </div>

        <div className='grid gap-6 lg:grid-cols-[320px_1fr]'>
          {/* Left Sidebar */}
          <div className='space-y-6'>
            <OrganizationInfo organizationId={subscription.organizationId} />

            <ContractInfo contractId={subscription.contractId} />
          </div>

          {/* Main Content */}
          <div className='space-y-6'>
            <SubscriptionInfo subscriptionId={subscription.id} />
            <OrganizationAdmins />
          </div>
        </div>
      </div>
    </div>
  )
}
