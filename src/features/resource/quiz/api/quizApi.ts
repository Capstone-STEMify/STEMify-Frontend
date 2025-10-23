import { Quiz, QuizQueryParams } from '@/features/resource/quiz/types/quiz.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const quizApi = createCrudApi<Quiz, QuizQueryParams>({
  reducerPath: 'quizApi',
  tagTypes: ['Quiz', 'QuizQuestions'],
  baseUrl: '/quizzes'
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

  // lazy
  useLazySearchQuery: useLazySearchQuizQuery,
  useLazyGetAllQuery: useLazyGetAllQuizQuery,
  useLazyGetByIdQuery: useLazyGetQuizByIdQuery
} = quizApi
