import {
  Attempt,
  QuestionAttemptQuery,
  Quiz,
  QuizAttempt,
  QuizImportResponse,
  QuizQueryParams
} from '@/features/resource/quiz/types/quiz.type'
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
    createQuizAttempt: builder.mutation<ApiSuccessResponse<Attempt>, { studentQuizId: number }>({
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
        quizAttemptId: number
        studentQuizId: number
        questionAttempts: QuestionAttemptQuery[]
      }
    >({
      query: ({ quizAttemptId, questionAttempts }) => ({
        url: `/quiz-attempts/${quizAttemptId}`,
        method: 'PATCH',
        body: { questionAttempts }
      }),
      invalidatesTags: (result, error, { studentQuizId }) => [{ type: 'Quiz', id: studentQuizId }]
    }),
    getQuizCSV: builder.query<
      ApiSuccessResponse<{
        csvFile: string
        fileName: string
      }>,
      void
    >({
      query: () => ({
        url: `/quizzes/template`,
        method: 'GET'
      })
    }),
    importQuizCSV: builder.mutation<ApiSuccessResponse<QuizImportResponse>, { csvFile: string; quizId: number }>({
      query: ({ quizId, csvFile }) => {
        return {
          url: `/quizzes/${quizId}/import`,
          method: 'POST',
          body: { csvFile }
        }
      },
      invalidatesTags: [{ type: 'Quiz' }]
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

  // csv
  useGetQuizCSVQuery,
  useImportQuizCSVMutation,

  // lazy
  useLazySearchQuery: useLazySearchQuizQuery,
  useLazyGetAllQuery: useLazyGetAllQuizQuery,
  useLazyGetByIdQuery: useLazyGetQuizByIdQuery
} = quizApi
