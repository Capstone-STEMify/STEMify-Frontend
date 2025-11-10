import {
  OrganizationSubscription,
  OrganizationSubscriptionSliceParams,
  SubscriptionFormData,
  UpdateSubscriptionFormData
} from '@/features/subscription/types/subscription.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { ApiSuccessResponse } from '@/types/baseModel'

export const subscriptionApi = createCrudApi<OrganizationSubscription, OrganizationSubscriptionSliceParams>({
  reducerPath: 'subscriptionApi',
  tagTypes: ['Subscription'],
  baseUrl: '/organization-subscription-orders'
}).injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation<ApiSuccessResponse<OrganizationSubscription>, SubscriptionFormData>({
      query: (data) => ({
        url: '/organization-subscription-orders',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Subscription']
    }),
    updateSubscription: builder.mutation<
      ApiSuccessResponse<OrganizationSubscription>,
      { subscriptionId: number; body: UpdateSubscriptionFormData }
    >({
      query: ({ subscriptionId, body }) => ({
        url: `/organization-subscription-orders/${subscriptionId}`,
        method: 'PATCH',
        body
      })
    })
  })
})

export const {
  useGetByIdQuery: useGetSubscriptionByIdQuery,
  useSearchQuery: useSearchSubscriptionQuery,
  useGetAllQuery: useGetAllSubscriptionQuery,
  useDeleteMutation: useDeleteSubscriptionMutation,

  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,

  // lazy
  useLazyGetByIdQuery: useLazyGetSubscriptionByIdQuery,
  useLazySearchQuery: useLazySearchSubscriptionQuery,
  useLazyGetAllQuery: useLazyGetAllSubscriptionQuery
} = subscriptionApi
