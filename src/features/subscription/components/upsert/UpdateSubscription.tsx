import { useAppForm } from '@/components/shared/form/items'
import { useGetSubscriptionByIdQuery, useUpdateSubscriptionMutation } from '@/features/subscription/api/subscriptionApi'
import React from 'react'

type UpsertSubscriptionProps = {
  subscriptionId: number
}

export default function UpdateSubscription({ subscriptionId }: UpsertSubscriptionProps) {
  const { data, isLoading } = useGetSubscriptionByIdQuery(subscriptionId, { skip: !subscriptionId })
  const [updateSubscription] = useUpdateSubscriptionMutation()
  const form = useAppForm({
    defaultValues: {},
    onSubmit: async (values) => {
      // await updateSubscription({ subscriptionId, body: values })
    }
  })
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!subscriptionId) {
    return <div>No subscription Id found</div>
  }

  return <div>UpdateSubscription</div>
}
