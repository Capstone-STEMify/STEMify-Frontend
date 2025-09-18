import { createCrudApi } from '@/libs/redux/baseApi'
import { CourseLearningOutcome, CourseLearningOutcomeQueryParams } from '../types/courseLearningOutcome.type'

export const courseLearningOutcomeApi = createCrudApi<CourseLearningOutcome, CourseLearningOutcomeQueryParams>({
  reducerPath: 'courseLearningOutcomeApi',
  tagTypes: ['CourseLearningOutcome'],
  baseUrl: '/course-learning-outcomes'
})

export const {
  useSearchQuery: useSearchCourseLearningOutcomeQuery,
  useGetByIdQuery: useGetCourseLearningOutcomeByIdQuery,
  useGetAllQuery: useGetAllCourseLearningOutcomeQuery,
  useCreateMutation: useCreateCourseLearningOutcomeMutation,
  useUpdateMutation: useUpdateCourseLearningOutcomeMutation,
  useDeleteMutation: useDeleteCourseLearningOutcomeMutation,

  // lazy
  useLazySearchQuery: useLazySearchCourseLearningOutcomeQuery,
  useLazyGetAllQuery: useLazyGetAllCourseLearningOutcomeQuery,
  useLazyGetByIdQuery: useLazyGetCourseLearningOutcomeByIdQuery
} = courseLearningOutcomeApi