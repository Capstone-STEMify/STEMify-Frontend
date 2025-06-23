import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import {
  ApiResponse,
  ApiSuccessResponse,
  BaseEntity,
  PaginatedResult,
  SearchPaginatedRequestParams
} from '@/types/baseModel'
import { ApiErrorResponse } from '@/types/baseModel'
import { BaseQueryApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query'
import { notFound } from 'next/navigation'
import { toast } from 'sonner'
import { getSession } from 'next-auth/react'

// =============================
// === Custom Base Query
// =============================

const rawBaseQuery = fetchBaseQuery({
  // baseUrl:
  //   process.env.NEXT_PUBLIC_BASE_API_URL ??
  //   (() => {
  //     throw new Error('Missing BASE_API_URL')
  //   })(),
  baseUrl: 'https://localhost:6002/api',
  credentials: 'include'
})

export const customFetchBaseQueryWithErrorHandling = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  const session = await getSession()
  const authHeaders = session?.user ? { Authorization: `Bearer ${session.accessToken}` } : {}
  // const result = await rawBaseQuery(args, api, extraOptions)

  const result = await rawBaseQuery(
    {
      ...(typeof args === 'string' ? { url: args } : args),
      headers: {
        ...(typeof args === 'object' ? args.headers : {}),
        ...authHeaders
      }
    },
    api,
    extraOptions
  )

  if (result.error) {
    const { status, data } = result.error
    const message = (data as any)?.message

    switch (status) {
      case 400:
        toast.error(message || 'Bad Request')
        break
      case 401:
        toast.error(message || 'Unauthorized')
        break
      case 403:
        toast.error(message || 'Forbidden')
        break
      case 404:
        toast.error(message || 'Not Found')
        break
      case 500:
        toast.error(message || 'Server Error')
        break
      case 'FETCH_ERROR':
        toast.error('Network error')
        break
      default:
        toast.error('Unexpected error')
    }
  }
  return result
}

// =============================
// === Create CRUD API
// =============================

type CrudApiOptions = {
  reducerPath: string
  tagType: string
  baseUrl: string
  baseQuery?: BaseQueryFn // Optional: your custom fetch logic, override the existing custom api
}

export function createCrudApi<T, P extends SearchPaginatedRequestParams>({
  reducerPath,
  tagType,
  baseUrl,
  baseQuery = customFetchBaseQueryWithErrorHandling
}: CrudApiOptions) {
  return createApi({
    reducerPath,

    baseQuery,

    tagTypes: [tagType],

    endpoints: (builder) => ({
      // GET: classrooms/1
      getById: builder.query<ApiSuccessResponse<T>, number | string>({
        query: (id) => `${baseUrl}/${id}`,
        providesTags: (result, error, id) => [{ type: tagType, id }]
      }),

      // GET: classrooms
      getAll: builder.query<ApiSuccessResponse<PaginatedResult<T>>, void>({
        query: () => ({ url: baseUrl }),
        providesTags: [tagType]
      }),

      // GET: search/classrooms?sort=nameAsc&pageNumber=1&pageSize=3&search=steam
      search: builder.query<ApiSuccessResponse<PaginatedResult<T>>, P>({
        query: (params) => ({
          url: baseUrl,
          method: 'GET',
          params: {
            pageNumber: params.pageNumber ?? 1,
            pageSize: params.pageSize ?? 10,
            ...params
          }
        }),
        providesTags: [tagType]
      }),
      // POST: classrooms/2
      create: builder.mutation<ApiSuccessResponse<T>, Partial<T>>({
        query: (body) => ({
          url: baseUrl,
          method: 'POST',
          body
        }),
        invalidatesTags: [tagType]
      }),

      // PUT: classrooms/2
      update: builder.mutation<ApiSuccessResponse<T>, { id: string | number; body: Partial<T> }>({
        query: ({ id, body }) => ({
          url: `${baseUrl}/${id}`,
          method: 'PATCH',
          body
        }),
        invalidatesTags: (result, error, { id }) => [{ type: tagType, id }, tagType]
      }),

      // DELETE: classrooms/2
      delete: builder.mutation<ApiResponse, number | string>({
        query: (id) => ({
          url: `${baseUrl}/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: (result, error, id) => [{ type: tagType, id }, tagType]
      })
    })
  })
}
