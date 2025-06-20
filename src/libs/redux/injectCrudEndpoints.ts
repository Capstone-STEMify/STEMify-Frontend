import { AllTagTypes, baseApi } from './baseApi'
import { ApiSuccessResponse, PaginatedResult, SearchPaginatedRequestParams } from '@/types/baseModel'

// =============================
// === Create CRUD API
// =============================

type CrudApiOptions = {
  tagType: AllTagTypes
  baseUrl: string
  searchUrl?: string
}

export function injectCrudEndpoints<T, P extends SearchPaginatedRequestParams>({ tagType, baseUrl }: CrudApiOptions) {
  return baseApi.injectEndpoints({
    endpoints: (builder) => ({
      getById: builder.query<ApiSuccessResponse<T>, string | number>({
        query: (id) => `${baseUrl}/${id}`,
        providesTags: (result, error, id) => [{ type: tagType, id }]
      }),
      getAll: builder.query<ApiSuccessResponse<PaginatedResult<T>>, void>({
        query: () => ({ url: baseUrl }),
        providesTags: [tagType]
      }),
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
      create: builder.mutation<T, Partial<T>>({
        query: (body) => ({
          url: baseUrl,
          method: 'POST',
          body
        }),
        invalidatesTags: [tagType]
      }),
      update: builder.mutation<T, { id: string | number; body: Partial<T> }>({
        query: ({ id, body }) => ({
          url: `${baseUrl}/${id}`,
          method: 'PUT',
          body
        }),
        invalidatesTags: (result, error, { id }) => [{ type: tagType, id }]
      }),
      delete: builder.mutation<{ success: boolean }, string | number>({
        query: (id) => ({
          url: `${baseUrl}/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: (result, error, id) => [{ type: tagType, id }, tagType]
      })
    }),
    overrideExisting: false
  })
}
