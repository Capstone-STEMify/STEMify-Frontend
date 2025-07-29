import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const chatAngentApi = createApi({
  reducerPath: 'chatAngentApi',
  // baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_AI_URL }),
  baseQuery: fetchBaseQuery({ baseUrl: 'https://ai-readdb.azurewebsites.net' }),
  tagTypes: ['ChatAgent'],
  endpoints: (builder) => ({
    getChatAi: builder.mutation<{ response: string }, { user_message: string }>({
      query: (body) => ({
        url: '/ask',
        method: 'POST',
        body
      })
    })
  })
})

export const { useGetChatAiMutation } = chatAngentApi
