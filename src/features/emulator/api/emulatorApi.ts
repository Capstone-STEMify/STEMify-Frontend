import {
  Emulator,
  EmulatorCreateRequest,
  EmulatorResponse,
  EmulatorSearchParams,
  EmulatorUpdateRequest,
  EmulatorWithThumbnail
} from '@/features/emulator/types/emulator.type'
import { RootState } from '@/libs/redux/store'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export const emulatorApi = createApi({
  reducerPath: 'emulatorApi',
  tagTypes: ['Emulator'],
  baseQuery: fetchBaseQuery({
    credentials: 'include',
    prepareHeaders: async (headers, api) => {
      const token = (api.getState() as RootState).auth.token
      if (token) {
        headers.set('Authorization', 'Bearer ' + token)
      }

      return headers
    },
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/emulator`
  }),

  refetchOnReconnect: false,
  refetchOnMountOrArgChange: false,
  keepUnusedDataFor: 3600,
  endpoints: (builder) => ({
    getEmulatorById: builder.query<ApiSuccessResponse<EmulatorWithThumbnail>, { emulationId: string }>({
      query: ({ emulationId }) => ({
        url: `/v1/emulations/${emulationId}`,
        method: 'GET'
      }),
      providesTags: ['Emulator']
    }),
    searchEmulations: builder.query<ApiSuccessResponse<EmulatorResponse>, EmulatorSearchParams>({
      query: (queryParams) => ({
        url: `/v1/emulations`,
        method: 'GET',
        params: queryParams
      }),
      providesTags: ['Emulator']
    }),
    createEmulator: builder.mutation<ApiSuccessResponse<EmulatorWithThumbnail>, { body: EmulatorCreateRequest }>({
      query: ({ body }) => ({
        url: '/v1/emulations:draft',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Emulator']
    }),
    updateEmulator: builder.mutation<any, { emulationId: string; body: Partial<EmulatorUpdateRequest> }>({
      query: ({ emulationId, body }) => ({
        url: `/v1/emulations/${emulationId}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Emulator']
    }),
    deleteEmulator: builder.mutation<ApiSuccessResponse<any>, { emulationId: string; permanent?: boolean }>({
      query: ({ emulationId, permanent }) => ({
        url: `/v1/emulations/${emulationId}`,
        method: 'DELETE',
        params: permanent ? { permanent } : undefined
      }),
      invalidatesTags: ['Emulator']
    })
  })
})

export const {
  useGetEmulatorByIdQuery,
  useSearchEmulationsQuery,
  useCreateEmulatorMutation,
  useUpdateEmulatorMutation,
  useDeleteEmulatorMutation
} = emulatorApi
