import { useUpdateSubscriptionMutation } from '@/features/subscription/api/subscriptionApi'
import React from 'react'

export default function UpsertSystemSubsctiption() {
  const [updateSubscription] = useUpdateSubscriptionMutation()
  return <div>UpsertSystemSubsctiption</div>
}
