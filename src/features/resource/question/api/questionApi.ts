import { Question } from '@/features/resource/question/types/question.type'
import { quizApi } from '@/features/resource/quiz/api/quizApi'
import { ApiSuccessResponse } from '@/types/baseModel'

type QuestionListResponse = {
  questions: Question[]
}

type CreateQuestionPayload = Omit<Question, 'id'> & {
  answers: Omit<Question['answers'][0], 'id'>[]
}

type UpdateQuestionPayload = Omit<Question, 'id'> & {
  id?: number
  answers: (Omit<Question['answers'][0], 'id'> & { id?: number })[]
}

export const questionApi = quizApi.injectEndpoints({
  endpoints: (build) => ({
    createQuestion: build.mutation<
      ApiSuccessResponse<QuestionListResponse>,
      // no question id and answer id
      { quizId: number; questions: any[] }
    >({
      query: ({ quizId, questions }) => ({
        url: `/quizzes/${quizId}/questions`,
        method: 'POST',
        body: {
          questions
        }
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Quiz', id: arg.quizId }]
    }),
    updateQuestion: build.mutation<ApiSuccessResponse<QuestionListResponse>, { quizId: number; questions: any[] }>({
      query: ({ quizId, questions }) => ({
        url: `/quizzes/${quizId}/questions`,
        method: 'PATCH',
        body: {
          questions
        }
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Quiz', id: arg.quizId }]
    })
  }),
  overrideExisting: false
})

export const { useCreateQuestionMutation, useUpdateQuestionMutation } = questionApi
