import { Emulator, EmulatorCreateRequest } from '@/features/emulator/types/emulator.type'
import { ApiSuccessResponse } from '@/types/baseModel'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export const emulatorApi = createApi({
  reducerPath: 'emulatorApi',
  tagTypes: ['Emulator'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/emulator`
  }),
  refetchOnFocus: false,
  refetchOnReconnect: false,
  refetchOnMountOrArgChange: false,
  keepUnusedDataFor: 3600,
  endpoints: (builder) => ({
    getEmulatorById: builder.query<ApiSuccessResponse<Emulator>, { emulatorId: string }>({
      query: ({ emulatorId }) => ({
        url: `/v1/emulations/${emulatorId}`,
        method: 'GET'
      }),
      providesTags: ['Emulator']
    }),
    createEmulator: builder.mutation<any, { body: EmulatorCreateRequest }>({
      query: ({ body }) => ({
        url: '/v1/emulations',
        method: 'POST',
        body
      }),
      // ⚠️ Không invalidate để tránh WebGL context lost
      invalidatesTags: []
    })
  })
})

export const { useGetEmulatorByIdQuery, useCreateEmulatorMutation } = emulatorApi
