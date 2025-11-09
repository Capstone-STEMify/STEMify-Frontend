import {
  OrganizationSubscription,
  OrganizationSubscriptionSliceParams,
  SubscriptionFormData
} from '@/features/subscription/types/subscription.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const subscriptionApi = createCrudApi<OrganizationSubscription, OrganizationSubscriptionSliceParams>({
  reducerPath: 'subscriptionApi',
  tagTypes: ['Subscription'],
  baseUrl: '/organization-subscription-orders'
}).injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation<any, SubscriptionFormData>({
      query: (data) => ({
        url: '/organization-subscription-orders',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Subscription']
    }),
    updateSubscription: builder.mutation<any, any>({
      query: ({ subscriptionId, data }) => ({
        url: `/organization-subscription-orders/${subscriptionId}`,
        method: 'PATCH',
        body: data
      })
    })
  })
})

export const {
  useGetByIdQuery: useGetSubscriptionByIdQuery,
  useSearchQuery: useSearchSubscriptionQuery,
  useGetAllQuery: useGetAllSubscriptionQuery,
  useUpdateMutation: useUpdateSubscriptionMutation,
  useDeleteMutation: useDeleteSubscriptionMutation,

  useCreateSubscriptionMutation,

  // lazy
  useLazyGetByIdQuery: useLazyGetSubscriptionByIdQuery,
  useLazySearchQuery: useLazySearchSubscriptionQuery,
  useLazyGetAllQuery: useLazyGetAllSubscriptionQuery
} = subscriptionApi
