import { createApi } from '@reduxjs/toolkit/query/react'
import { Certificate, CertificateQueryParams } from '@/features/certificate/types/certificate.type'
import { customFetchBaseQueryWithErrorHandling } from '@/libs/redux/baseApi'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'

export const certificateApi = createApi({
  reducerPath: 'certificateApi',
  baseQuery: customFetchBaseQueryWithErrorHandling,
  tagTypes: ['Certificate'],
  endpoints: (builder) => ({
    getById: builder.query<ApiSuccessResponse<Certificate>, number | string>({
      query: (id) => `/certificates/${id}`,
      transformResponse: (response: any) => {
        return {
          ...response,
          data: response.data?.certificate || response.data
        }
      },
      providesTags: (result, error, id) => [{ type: 'Certificate', id }]
    }),

    search: builder.query<ApiSuccessResponse<PaginatedResult<Certificate>>, CertificateQueryParams>({
      query: (params) => ({
        url: '/certificates',
        method: 'GET',
        params
      }),
      providesTags: ['Certificate']
    })
  })
})

export const {
  useGetByIdQuery: useGetCertificateByIdQuery,
  useSearchQuery: useSearchCertificateQuery,
  
  // lazy hooks
  useLazyGetByIdQuery: useLazyGetCertificateByIdQuery,
  useLazySearchQuery: useLazySearchCertificateQuery
} = certificateApi