import { QuestionAttempt, Quiz, QuizAttempt, QuizQueryParams } from '@/features/resource/quiz/types/quiz.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'

export const quizApi = createCrudApi<Quiz, QuizQueryParams>({
  reducerPath: 'quizApi',
  tagTypes: ['Quiz', 'QuizQuestions'],
  baseUrl: '/quizzes'
}).injectEndpoints({
  endpoints: (builder) => ({
    getStudentQuizById: builder.query<ApiSuccessResponse<QuizAttempt>, number>({
      query: (id: number) => ({
        url: `/student-quizzes/${id}`
      }),
      providesTags: (result, error, id) => [{ type: 'Quiz', id }]
    }),
    getStudentQuizByClassroom: builder.query<
      ApiSuccessResponse<PaginatedResult<QuizAttempt[]>>,
      { classroomId: number }
    >({
      query: ({ classroomId }) => ({
        url: `/student-quizzes`,
        params: { classroomId }
      })
    }),
    createQuizAttempt: builder.mutation<any, { studentQuizId: number }>({
      query: ({ studentQuizId }) => ({
        url: `/quiz-attempts`,
        method: 'POST',
        body: {
          studentQuizId
        }
      }),
      invalidatesTags: (result, error, { studentQuizId }) => [{ type: 'Quiz', id: studentQuizId }]
    }),
    updateQuizAttempt: builder.mutation<
      any,
      {
        studentQuizId: number
        questionAttempts: QuestionAttempt[]
      }
    >({
      query: ({ studentQuizId, questionAttempts }) => ({
        url: `/quiz-attempts/${studentQuizId}`,
        method: 'PATCH',
        body: { questionAttempts }
      }),
      invalidatesTags: (result, error, { studentQuizId }) => [{ type: 'Quiz', id: studentQuizId }]
    })
  })
})

export const {
  // queries
  useSearchQuery: useSearchQuizQuery,
  useGetAllQuery: useGetAllQuizQuery,
  useGetByIdQuery: useGetQuizByIdQuery,

  // mutations
  useCreateMutation: useCreateQuizMutation,
  useUpdateMutation: useUpdateQuizMutation,
  useDeleteMutation: useDeleteQuizMutation,

  // quiz attempt
  useGetStudentQuizByIdQuery,
  useGetStudentQuizByClassroomQuery,
  useCreateQuizAttemptMutation,
  useUpdateQuizAttemptMutation,

  // lazy
  useLazySearchQuery: useLazySearchQuizQuery,
  useLazyGetAllQuery: useLazyGetAllQuizQuery,
  useLazyGetByIdQuery: useLazyGetQuizByIdQuery
} = quizApi
