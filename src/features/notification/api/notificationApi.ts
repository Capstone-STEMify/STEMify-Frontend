import { Notification, NotificationQueryParams } from '@/features/notification/types/notification.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const notificationApi = createCrudApi<Notification, NotificationQueryParams>({
  reducerPath: 'NotificationApi',
  tagType: 'Notification',
  baseUrl: '/notifications'
})

export const {
  // queries
  useSearchQuery: useSearchNotificationQuery,
  useGetAllQuery: useGetAllNotificationQuery,
  useGetByIdQuery: useGetNotificationByIdQuery,

  // mutations
  useCreateMutation: useCreateNotificationMutaion,
  useUpdateMutation: useUpdateNotificationMutation,
  useDeleteMutation: useDeleteNotificationMutation,

  // lazy
  useLazySearchQuery: useLazySearchNotificationQuery,
  useLazyGetAllQuery: useLazyGetAllNotificationQuery,
  useLazyGetByIdQuery: useLazyGetNotificationByIdQuery
} = notificationApi
