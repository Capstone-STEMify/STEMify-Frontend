import { Question } from '@/features/resource/question/types/question.type'
import { quizApi } from '@/features/resource/quiz/api/quizApi'
import { ApiSuccessResponse } from '@/types/baseModel'

export const questionApi = quizApi.injectEndpoints({
  endpoints: (build) => ({
    createQuestion: build.mutation<ApiSuccessResponse<Question>, { quizId: number; questions: Question[] }>({
      query: ({ quizId, questions }) => ({
        url: `/quizzes/${quizId}/questions`,
        method: 'POST',
        body: {
          questions
        }
      }),
      invalidatesTags: ['QuizQuestions']
    }),
    updateQuestion: build.mutation<ApiSuccessResponse<Question>, { quizId: number; questions: Question[] }>({
      query: ({ quizId, questions }) => ({
        url: `/quizzes/${quizId}/questions`,
        method: 'PATCH',
        body: {
          questions
        }
      }),
      invalidatesTags: ['QuizQuestions']
    })
  }),
  overrideExisting: false
})

export const { useCreateQuestionMutation, useUpdateQuestionMutation } = questionApi
