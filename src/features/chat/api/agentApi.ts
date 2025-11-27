import { LessonSectionAIResponse } from '@/features/chat/types/agent.type'
import { ApiSuccessResponse } from '@/types/baseModel'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const agentApi = createApi({
  reducerPath: 'chatAgentApi',
  // baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_AI_URL }),
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    responseHandler: async (response) => {
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        return response.json()
      }
      // Nếu backend trả text/plain
      const text = await response.text()
      return { data: { message: text } }
    }
  }),
  tagTypes: ['ChatAgent'],
  endpoints: (builder) => ({
    // CHAT - AI
    getCourseRecommendedAi: builder.mutation<ApiSuccessResponse<{ message: string }>, { userPrompt: string }>({
      query: (body) => ({
        url: '/ai/course-recommendations',
        method: 'POST',
        body
      })
    }),
    getGeneralChatAi: builder.mutation<ApiSuccessResponse<{ message: string }>, { userPrompt: string }>({
      query: (body) => ({
        url: '/ai/general-question',
        method: 'POST',
        body
      })
    }),

    // Section AI Generator
    generateSection: builder.mutation<LessonSectionAIResponse, { lesson_id: string; force_mock: boolean }>({
      query: (body) => ({
        url: '/ai/content/lesson-section',
        method: 'POST',
        body
      })
    })
  })
})

export const { useGetCourseRecommendedAiMutation, useGetGeneralChatAiMutation, useGenerateSectionMutation } = agentApi
