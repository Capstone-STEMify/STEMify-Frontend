import BackButton from '@/components/shared/button/BackButton'
import CreateSubscriptionOrg from '@/features/subscription/components/upsert/CreateSubscriptionOrg'
import React from 'react'

export default function CreateSubscriptionOrgPage() {
  return (
    <div className='bg-gradient-to-br from-slate-50 to-slate-100 p-6'>
      <BackButton />
      <CreateSubscriptionOrg />
    </div>
  )
}
