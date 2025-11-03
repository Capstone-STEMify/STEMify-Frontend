import { Quiz, QuizQueryParams } from '@/features/resource/quiz/types/quiz.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const quizApi = createCrudApi<Quiz, QuizQueryParams>({
  reducerPath: 'quizApi',
  tagTypes: ['Quiz', 'QuizQuestions'],
  baseUrl: '/quizzes'
}).injectEndpoints({
  endpoints: (builder) => ({
    getStudentQuizById: builder.query<Quiz, number>({
      query: (id: number) => ({
        url: `/quizzes/${id}/student-view`
      }),
      providesTags: (result, error, id) => [{ type: 'Quiz', id }]
    }),
    getStudentQuizByClassroom: builder.query<Quiz[], { classroomId: number }>({
      query: ({ classroomId }) => ({
        url: `/classrooms/${classroomId}/quizzes/student-view`
      })
    }),
    createQuizAttempt: builder.mutation<void, { quizId: number }>({
      query: ({ quizId }) => ({
        url: `/quizzes/${quizId}/attempts`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, { quizId }) => [{ type: 'Quiz', id: quizId }]
    }),
    updateQuizAttempt: builder.mutation<void, { quizId: number; attemptData: any }>({
      query: ({ quizId, attemptData }) => ({
        url: `/quizzes/${quizId}/attempts`,
        method: 'PUT',
        body: attemptData
      }),
      invalidatesTags: (result, error, { quizId }) => [{ type: 'Quiz', id: quizId }]
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
