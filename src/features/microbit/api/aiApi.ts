import { ApiSuccessResponse } from './../../../types/baseModel'
import { createApi } from '@reduxjs/toolkit/query/react'
import { customFetchBaseQueryWithErrorHandling } from '@/libs/redux/baseApi'
import { MicrobitEvaluateRequest, MicrobitEvaluateResponse } from '../type/ai.type'

export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: customFetchBaseQueryWithErrorHandling,
  tagTypes: ['Ai'],
  endpoints: (builder) => ({
    analyzeProject: builder.mutation<MicrobitEvaluateResponse, MicrobitEvaluateRequest>({
      query: (body) => ({
        url: '/ai/microbit/analyze-project',
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['Ai']
    })
  })
})

export const { useAnalyzeProjectMutation } = aiApi
