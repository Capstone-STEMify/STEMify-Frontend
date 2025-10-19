import { Contact, ContactQueryParams } from '@/features/contact/types/contact.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const contactApi = createCrudApi<Contact, ContactQueryParams>({
  reducerPath: 'contactApi',
  tagTypes: ['Contact'],
  baseUrl: '/contacts'
})

export const {
  // queries
  useSearchQuery: useSearchContactQuery,
  useGetAllQuery: useGetAllContactQuery,
  useGetByIdQuery: useGetContactByIdQuery,

  // mutations
  useCreateMutation: useCreateContactMutation,
  useUpdateMutation: useUpdateContactMutation,
  useDeleteMutation: useDeleteContactMutation,

  // lazy
  useLazySearchQuery: useLazySearchContactQuery,
  useLazyGetAllQuery: useLazyGetAllContactQuery,
  useLazyGetByIdQuery: useLazyGetContactByIdQuery
} = contactApi
