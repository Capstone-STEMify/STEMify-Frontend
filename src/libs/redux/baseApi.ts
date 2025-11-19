import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import { ApiResponse, ApiSuccessResponse, PaginatedResult, SearchPaginatedRequestParams } from '@/types/baseModel'
import { BaseQueryApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query'
import { notFound, redirect } from 'next/navigation'
import { toast } from 'sonner'
import { RootState } from '@/libs/redux/store'
import { signIn } from 'next-auth/react'

const customFetchBaseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL ??
    (() => {
      throw new Error('Missing BASE_API_URL')
    })(),
  credentials: 'include',
  prepareHeaders: async (headers, api) => {
    const token = (api.getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', 'Bearer ' + token)
    }

    const activeOrg = (api.getState() as RootState).selectedOrganization.selectedOrganizationId
    const activeSub = (api.getState() as RootState).selectedOrganization.selectedSubscriptionOrderId

    if (activeOrg) headers.set('X-Active-Organization', String(activeOrg))
    if (activeSub) headers.set('X-Active-Subscription', String(activeSub))

    return headers
  }
})

export const customFetchBaseQueryWithErrorHandling = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
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
        signIn('oidc', { callbackUrl: `/`, prompt: 'login' })
        break
      case 403:
        toast.error(message || 'Forbidden')
        redirect('/unauthorized')
      case 404:
        toast.error(message || 'Not Found')
        notFound()
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
  tagTypes: string[]
  baseUrl: string
  baseQuery?: BaseQueryFn
}

export function createCrudApi<T, P extends SearchPaginatedRequestParams>({
  reducerPath,
  tagTypes,
  baseUrl,
  baseQuery = customFetchBaseQueryWithErrorHandling
}: CrudApiOptions) {
  const handleDynamicUrl = (url: string, params: any) => {
    let dynamicUrl = url
    const queryParams = { ...params }
    const pathParams = url.match(/\{[^\}]+\}/g) || []

    pathParams.forEach((placeholder) => {
      const key = placeholder.substring(1, placeholder.length - 1)
      if (key in queryParams) {
        dynamicUrl = dynamicUrl.replace(placeholder, String(queryParams[key as keyof P]))
        delete queryParams[key as keyof P]
      }
    })

    return { dynamicUrl, queryParams }
  }

  return createApi({
    reducerPath,

    baseQuery,

    tagTypes,

    endpoints: (builder) => ({
      // GET: classrooms/1
      getById: builder.query<ApiSuccessResponse<T>, number | string>({
        query: (id) => `${baseUrl}/${id}`,
        providesTags: (result, error, id) => [...tagTypes.map((t) => ({ type: t, id }))]
      }),

      // GET: classrooms
      getAll: builder.query<ApiSuccessResponse<PaginatedResult<T>>, void | SearchPaginatedRequestParams>({
        query: (params) => {
          const { dynamicUrl, queryParams } = handleDynamicUrl(baseUrl, params || {})
          return { url: dynamicUrl, params: queryParams }
        },
        providesTags: tagTypes
      }),

      // GET: search/classrooms?sort=nameAsc&pageNumber=1&pageSize=3&search=steam
      search: builder.query<ApiSuccessResponse<PaginatedResult<T>>, P>({
        query: (params) => {
          const { dynamicUrl, queryParams } = handleDynamicUrl(baseUrl, params)

          return {
            url: dynamicUrl,
            method: 'GET',
            params: {
              pageNumber: queryParams.pageNumber ?? 1,
              pageSize: queryParams.pageSize ?? 10,
              ...queryParams
            }
          }
        },
        providesTags: tagTypes
      }),
      // POST: classrooms/2
      create: builder.mutation<ApiSuccessResponse<T>, Partial<T>>({
        query: (body) => ({
          url: baseUrl,
          method: 'POST',
          body
        }),
        invalidatesTags: tagTypes
      }),

      // PUT: classrooms/2
      update: builder.mutation<ApiSuccessResponse<T>, { id: string | number; body: Partial<T> }>({
        query: ({ id, body }) => ({
          url: `${baseUrl}/${id}`,
          method: 'PATCH',
          body
        }),
        invalidatesTags: (result, error, { id }) => [...tagTypes.map((t) => ({ type: t, id })), ...tagTypes]
      }),

      // DELETE: classrooms/2
      delete: builder.mutation<ApiResponse, number | string>({
        query: (id) => ({
          url: `${baseUrl}/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: (result, error, id) => [...tagTypes.map((t) => ({ type: t, id })), ...tagTypes]
      })
    })
  })
}
