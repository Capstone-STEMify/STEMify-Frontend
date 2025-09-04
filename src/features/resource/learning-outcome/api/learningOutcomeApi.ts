import { createCrudApi } from '@/libs/redux/baseApi'
import { LearningOutcome, LearningOutcomeQueryParams } from '../types/learningOutcome.type'

export const learningOutcomeApi = createCrudApi<LearningOutcome, LearningOutcomeQueryParams>({
  reducerPath: 'learningOutcomeApi',
  tagTypes: ['LearningOutcome'],
  baseUrl: '/program-learning-outcomes'
})

export const {
  useSearchQuery: useSearchLearningOutcomeQuery,
  useGetByIdQuery: useGetLearningOutcomeByIdQuery,
  useGetAllQuery: useGetAllLearningOutcomeQuery,
  useCreateMutation: useCreateLearningOutcomeMutation,
  useUpdateMutation: useUpdateLearningOutcomeMutation,
  useDeleteMutation: useDeleteLearningOutcomeMutation,

  // lazy
  useLazySearchQuery: useLazySearchLearningOutcomeQuery,
  useLazyGetAllQuery: useLazyGetAllLearningOutcomeQuery,
  useLazyGetByIdQuery: useLazyGetLearningOutcomeByIdQuery
} = learningOutcomeApi
