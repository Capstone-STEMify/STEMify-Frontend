import { ApiSuccessResponse } from './../../../types/baseModel';
import { createApi } from '@reduxjs/toolkit/query/react'
import { customFetchBaseQueryWithErrorHandling } from '@/libs/redux/baseApi'
import { SystemDashboardQueryParams, SystemDashboardData } from '../types/systemDashboard.type'

export const systemDashboardApi = createApi({
  reducerPath: 'systemDashboardApi',
  baseQuery: customFetchBaseQueryWithErrorHandling,
  tagTypes: ['SystemDashboard'],
  endpoints: (builder) => ({
    getSystemDashboard: builder.query<ApiSuccessResponse<SystemDashboardData>, SystemDashboardQueryParams>({
      query: (params) => ({
        url: '/admin/dashboard',
        method: 'GET',
        params: params
      }),
      providesTags: ['SystemDashboard']
    })
  })
})

export const { useGetSystemDashboardQuery } = systemDashboardApi