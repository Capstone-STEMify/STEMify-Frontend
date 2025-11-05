import { createCrudApi } from '@/libs/redux/baseApi'
import { DashboardStatisticQueryParam, DashboardStatistics } from '../types/dashboard.type'

export const orgDashboardApi = createCrudApi<DashboardStatistics, DashboardStatisticQueryParam>({
  reducerPath: 'orgDashboardApi',
  tagTypes: ['OrgDashboard'],
  baseUrl: '/student-quizzes'
})

export const {
  useGetByIdQuery: useGetOrgDashboardQuery,
  useSearchQuery: useSearchOrgDashboardQuery,
  useGetAllQuery: useGetAllOrgDashboardQuery,

  // lazy
  useLazyGetByIdQuery: useLazyGetOrgDashboardByIdQuery,
  useLazySearchQuery: useLazySearchOrgDashboardQuery,
  useLazyGetAllQuery: useLazyGetAllOrgDashboardQuery
} = orgDashboardApi
