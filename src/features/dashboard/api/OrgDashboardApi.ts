import { createApi } from '@reduxjs/toolkit/query/react'
import { customFetchBaseQueryWithErrorHandling } from '@/libs/redux/baseApi'
import { ApiSuccessResponse } from '@/types/baseModel'
import { DashboardData, DashboardStatisticQueryParam } from '../types/dashboard.type'

export const orgDashboardApi = createApi({
  reducerPath: 'orgDashboardApi',
  baseQuery: customFetchBaseQueryWithErrorHandling,
  tagTypes: ['OrgDashboard'],
  endpoints: (builder) => ({
    search: builder.query<ApiSuccessResponse<DashboardData>, DashboardStatisticQueryParam>({
      query: (params) => {
        const { organizationId, ...queryParams } = params

        const dynamicUrl = `/organizations/${organizationId}/dashboard`

        return {
          url: dynamicUrl,
          method: 'GET',
          params: queryParams
        }
      },
      providesTags: (result, error, params) => [{ type: 'OrgDashboard', id: params.organizationId }]
    })
  })
})

export const { useSearchQuery: useSearchOrgDashboardQuery, useLazySearchQuery: useLazySearchOrgDashboardQuery } =
  orgDashboardApi
