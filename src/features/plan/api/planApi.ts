import { PlanProduct, PlanProductSliceParams } from '@/features/plan/types/plan.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const planApi = createCrudApi<PlanProduct, PlanProductSliceParams>({
  reducerPath: 'planProductApi',
  tagTypes: ['PlanProduct'],
  baseUrl: '/plan-products'
})

export const {
  useSearchQuery: useSearchPlanProductQuery,
  useGetByIdQuery: useGetPlanProductByIdQuery,
  useGetAllQuery: useGetAllPlanProductQuery,
  useCreateMutation: useCreatePlanProductMutation,
  useUpdateMutation: useUpdatePlanProductMutation,
  useDeleteMutation: useDeletePlanProductMutation,

  // lazy
  useLazySearchQuery: useLazySearchPlanProductQuery,
  useLazyGetAllQuery: useLazyGetAllPlanProductQuery,
  useLazyGetByIdQuery: useLazyGetPlanProductByIdQuery
} = planApi
