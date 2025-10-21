import { Plan, PlanSliceParams } from '@/features/plan/types/plan.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const planApi = createCrudApi<Plan, PlanSliceParams>({
  reducerPath: 'planApi',
  tagTypes: ['Plan'],
  baseUrl: '/plans'
})

export const {
  useSearchQuery: useSearchPlanQuery,
  useGetByIdQuery: useGetPlanByIdQuery,
  useGetAllQuery: useGetAllPlanQuery,
  useCreateMutation: useCreatePlanMutation,
  useUpdateMutation: useUpdatePlanMutation,
  useDeleteMutation: useDeletePlanMutation,

  // lazy
  useLazySearchQuery: useLazySearchPlanQuery,
  useLazyGetAllQuery: useLazyGetAllPlanQuery,
  useLazyGetByIdQuery: useLazyGetPlanByIdQuery
} = planApi
