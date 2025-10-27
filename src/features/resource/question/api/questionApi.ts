import { Question } from '@/features/resource/question/types/question.type'
import { quizApi } from '@/features/resource/quiz/api/quizApi'
import { ApiSuccessResponse } from '@/types/baseModel'

type QuestionListResponse = {
  questions: Question[]
}

export const questionApi = quizApi.injectEndpoints({
  endpoints: (build) => ({
    createQuestion: build.mutation<ApiSuccessResponse<QuestionListResponse>, { quizId: number; questions: Question[] }>(
      {
        query: ({ quizId, questions }) => ({
          url: `/quizzes/${quizId}/questions`,
          method: 'POST',
          body: {
            questions
          }
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Quiz', id: arg.quizId }]
      }
    ),
    updateQuestion: build.mutation<ApiSuccessResponse<QuestionListResponse>, { quizId: number; questions: Question[] }>(
      {
        query: ({ quizId, questions }) => ({
          url: `/quizzes/${quizId}/questions`,
          method: 'PATCH',
          body: {
            questions
          }
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Quiz', id: arg.quizId }]
      }
    )
  }),
  overrideExisting: false
})

export const { useCreateQuestionMutation, useUpdateQuestionMutation } = questionApi
