import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import { ApiResponse, ApiSuccessResponse, PaginatedResult, SearchPaginatedRequestParams } from '@/types/baseModel'
import { BaseQueryApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query'
import { notFound } from 'next/navigation'
import { toast } from 'sonner'
import { RootState } from '@/libs/redux/store'
import { getToken } from 'next-auth/jwt'
import { useAppSelector } from '@/hooks/redux-hooks'
import { signIn } from 'next-auth/react'

const customFetchBaseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL ??
    (() => {
      throw new Error('Missing BASE_API_URL')
    })(),
  credentials: 'include',
  prepareHeaders: async (headers, api) => {
    // Append token from the auth state tree Redux store
    const token = (api.getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', 'Bearer ' + token)
    }

    return headers
  }
})

export const customFetchBaseQueryWithErrorHandling = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  console.log('🔍 customFetchBaseQueryWithErrorHandling', process.env.NEXT_PUBLIC_API_URL)
  const result = await customFetchBaseQuery(args, api, extraOptions)

  if (result.error) {
    const { status, data } = result.error
    const message = (data as any)?.message

    switch (status) {
      case 400:
        toast.error(message || 'Bad Request')
        break
      case 401:
        toast.error(message || 'Unauthorized! Please sign in for access')
        // signIn('oidc', { callbackUrl: `/`, prompt: 'login' })
        break
      case 403:
        toast.error(message || 'Forbidden')
        signIn('oidc', { callbackUrl: `/`, prompt: 'login' })
        break
      case 404:
        toast.error(message || 'Not Found')
        notFound() // Redirect to 404 page
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
  baseQuery?: BaseQueryFn
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

      // POST: classrooms/2
      createFormData: builder.mutation<ApiSuccessResponse<T>, FormData>({
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

      // PUT: classrooms/2
      updateFormData: builder.mutation<ApiSuccessResponse<T>, { id: string | number; body: FormData }>({
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
