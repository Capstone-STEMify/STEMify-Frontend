import { Question } from '@/features/resource/question/types/question.type'
import { quizApi } from '@/features/resource/quiz/api/quizApi'
import { ApiSuccessResponse } from '@/types/baseModel'

export const questionApi = quizApi.injectEndpoints({
  endpoints: (build) => ({
    createQuestion: build.mutation<ApiSuccessResponse<Question>, { quizId: number; body: Question }>({
      query: ({ quizId, body }) => ({
        url: `/quizzes/${quizId}/questions`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['QuizQuestions']
    })
  }),
  overrideExisting: false
})
