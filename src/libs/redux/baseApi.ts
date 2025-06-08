import {
  ApiErrorResponse,
  ApiSuccessResponse,
  BaseEntity,
  PaginatedResult,
  SearchPaginatedRequestParams
} from '@/types/baseModel'
import { BaseQueryApi, BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query'
import { notFound } from 'next/navigation'
import { toast } from 'sonner'

// =============================
// === Custom Base Query
// =============================

const customFetchBaseQuery = fetchBaseQuery({
  // baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
  baseUrl: '',
  credentials: 'include'
})

export const customFetchBaseQueryWithErrorHandling = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  const result = await customFetchBaseQuery(args, api, extraOptions)

  if (result.error) {
    const status =
      result.error.status === 'PARSING_ERROR' && result.error.originalStatus
        ? result.error.originalStatus
        : result.error.status
    const data = result.error.data as ApiErrorResponse

    switch (status) {
      case 400:
        toast.error(data?.message || 'Bad Request')
        break
      case 401:
        toast.error(data?.message || 'Unauthorized')
        break
      case 403:
        toast.error(data?.message || 'Forbidden')
        break
      case 500:
        toast.error(data?.message || 'Server Error')
        break
      case 404:
        toast.error(data?.message || 'Not Found')
        break
      case 'FETCH_ERROR':
        toast.error('fetch Error')
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

export type CrudApiOptions = {
  reducerPath: string
  tagType: string
  baseUrl: string
  searchUrl?: string // Optional endpoint for paginated search
  baseQuery?: BaseQueryFn // Optional: your custom fetch logic, override the existing custom api
}
export function createCRUDApi<T, P extends SearchPaginatedRequestParams>({
  reducerPath,
  tagType,
  baseUrl,
  searchUrl,
  baseQuery = customFetchBaseQueryWithErrorHandling
}: CrudApiOptions) {
  return createApi({
    reducerPath,
    baseQuery,
    tagTypes: [tagType],
    endpoints: (builder) => ({
      //GET: lessons/1
      getById: builder.query<T, string | number>({
        query: (id) => `${baseUrl}/${id}`,
        providesTags: (result, error, id) => [{ type: tagType, id }]
      }),

      //GET: lessons
      getAll: builder.query<ApiSuccessResponse<PaginatedResult<T>>, void>({
        query: (params) => ({
          url: baseUrl
        }),
        providesTags: [tagType]
      }),

      // GET: lessons?sort=nameAsc&pageNumber=1&pageSize=10&search=title
      search: searchUrl
        ? builder.query<ApiSuccessResponse<PaginatedResult<T>>, P>({
            query: (params) => ({
              url: searchUrl,
              method: 'GET',
              params: {
                pageNumber: params.pageNumber ?? 1,
                pageSize: params.pageSize ?? 10,
                ...params
              }
            }),
            providesTags: [tagType]
          })
        : // If no searchUrl is provided, return an empty query
          builder.query<ApiSuccessResponse<PaginatedResult<T>>, P>({
            query: (params) => ({
              url: '',
              method: 'GET',
              params: {
                pageNumber: params.pageNumber ?? 1,
                pageSize: params.pageSize ?? 10,
                ...params
              }
            }),
            providesTags: [tagType]
          }),

      //POST: lessons
      create: builder.mutation<T, Partial<T>>({
        query: (body) => ({
          url: baseUrl,
          method: 'POST',
          body
        }),
        invalidatesTags: [tagType]
      }),

      //PUT: lessons/1
      update: builder.mutation<T, { id: string | number; body: Partial<T> }>({
        query: ({ id, body }) => ({
          url: `${baseUrl}/${id}`,
          method: 'PUT',
          body
        }),
        invalidatesTags: (result, error, { id }) => [{ type: tagType, id }]
      }),

      //DELETE: lessons/1
      delete: builder.mutation<{ success: boolean }, string | number>({
        query: (id) => ({
          url: `${baseUrl}/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: (result, error, id) => [{ type: tagType, id }, tagType]
      })
    })
  })
}
