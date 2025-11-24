'use client'

import { Button } from '@/components/shadcn/button'
import OrganizationInfo from '@/features/subscription/components/detail/system/OrganizationInfo'
import OrganizationAdmins from '@/features/subscription/components/detail/system/OrganizationAdmins'
import { useGetSubscriptionByIdQuery } from '@/features/subscription/api/subscriptionApi'
import { useParams } from 'next/navigation'
import ContractInfo from '@/features/subscription/components/detail/system/ContractInfo'
import SubscriptionInfo from '@/features/subscription/components/detail/system/SubscriptionInfo'
import BackButton from '@/components/shared/button/BackButton'
import SEmpty from '@/components/shared/empty/SEmpty'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useTranslations } from 'next-intl'

export default function SystemSubscriptionDetail() {
  const to = useTranslations('organization.detail')

  const { subscriptionId } = useParams()
  const { data, isLoading } = useGetSubscriptionByIdQuery(Number(subscriptionId))
  const subscription = data?.data

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <LoadingComponent />
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <SEmpty title={to('noSubscription')} />
      </div>
    )
  }
  return (
    <div className='bg-muted/30 min-h-screen p-6'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6 flex items-center justify-start gap-4'>
          <BackButton />
          <h1 className='text-2xl font-semibold'>{to('header')}</h1>
        </div>

        <div className='grid gap-6 lg:grid-cols-[320px_1fr]'>
          {/* Left Sidebar */}
          <div className='space-y-6'>
            <OrganizationInfo organizationId={subscription.organizationId} />

            <ContractInfo contractId={subscription.contractId} />
          </div>

          {/* Main Content */}
          <div className='space-y-6'>
            <SubscriptionInfo subscription={subscription} />
            <OrganizationAdmins organizationSubscriptionOrderId={subscription.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
