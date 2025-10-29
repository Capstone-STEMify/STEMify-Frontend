import { createCrudApi } from '@/libs/redux/baseApi'
import { QuizStatisticQueryParam, QuizStatistics } from '../types/studentQuiz.type'

export const studentQuizApi = createCrudApi<QuizStatistics, QuizStatisticQueryParam>({
  reducerPath: 'studentQuizApi',
  tagTypes: ['StudentQuiz'],
  baseUrl: '/student-quizzes'
})

export const {
  useGetByIdQuery: useGetStudentQuizByIdQuery,
  useSearchQuery: useSearchStudentQuizQuery,
  useGetAllQuery: useGetAllStudentQuizQuery,

  // lazy
  useLazyGetByIdQuery: useLazyGetStudentQuizByIdQuery,
  useLazySearchQuery: useLazySearchStudentQuizQuery,
  useLazyGetAllQuery: useLazyGetAllStudentQuizQuery
} = studentQuizApi
