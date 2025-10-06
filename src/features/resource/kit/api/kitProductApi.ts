import { createCrudApi } from '@/libs/redux/baseApi'
import { Kit, KitSliceParams } from '@/features/resource/kit/types/kit.type'

export const kitProductApi = createCrudApi<Kit, KitSliceParams>({
  reducerPath: 'kitproductApi',
  tagTypes: ['Product', 'Kit', 'Component', 'Course'],
  baseUrl: '/kit-products'
})

export const {
  useSearchQuery: useSearchKitQuery,
  useGetByIdQuery: useGetKitByIdQuery,
  useGetAllQuery: useGetAllKitQuery,
  useCreateMutation: useCreateKitMutation,
  useUpdateMutation: useUpdateKitMutation,
  useDeleteMutation: useDeleteKitMutation,

  // lazy
  useLazySearchQuery: useLazySearchKitQuery,
  useLazyGetAllQuery: useLazyGetAllKitQuery,
  useLazyGetByIdQuery: useLazyGetKitByIdQuery
} = kitProductApi
