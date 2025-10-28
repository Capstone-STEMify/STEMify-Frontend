import { createCrudApi } from '@/libs/redux/baseApi'
import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { QuizStatistics } from '../types/studentQuiz.type'

export const studentQuizApi = createCrudApi<QuizStatistics, SliceQueryParams>({
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