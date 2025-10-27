import { CourseEnrollment, CourseEnrollmentSliceParams } from '@/features/enrollment/types/enrollment.type'
import { OrganizationSubscription } from '@/features/subscription/types/subscription.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const subscriptionApi = createCrudApi<OrganizationSubscription, CourseEnrollmentSliceParams>({
  reducerPath: 'subscriptionApi',
  tagTypes: ['Subscription'],
  baseUrl: '/organization-subscription-orders'
})

export const {
  useGetByIdQuery: useGetSubscriptionByIdQuery,
  useSearchQuery: useSearchSubscriptionQuery,
  useGetAllQuery: useGetAllSubscriptionQuery,
  useCreateMutation: useCreateSubscriptionMutation,
  useUpdateMutation: useUpdateSubscriptionMutation,
  useDeleteMutation: useDeleteSubscriptionMutation,

  // lazy
  useLazyGetByIdQuery: useLazyGetSubscriptionByIdQuery,
  useLazySearchQuery: useLazySearchSubscriptionQuery,
  useLazyGetAllQuery: useLazyGetAllSubscriptionQuery
} = subscriptionApi
