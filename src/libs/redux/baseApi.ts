import { ApiSuccessResponse, BaseEntity, PaginatedResult, SearchPaginatedRequestParams } from '@/types/baseModel'
import { BaseQueryApi, BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query'
import { notFound } from 'next/navigation'

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
    console.error(result.error)
    const status = result.error.status
    if (status === 404) {
      notFound()
    }
    if (status === 502) {
      throw new Error('Bad Gateway: Backend service is unavailable')
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
