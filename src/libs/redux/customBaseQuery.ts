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
