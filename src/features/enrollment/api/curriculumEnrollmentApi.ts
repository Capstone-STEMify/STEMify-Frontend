import {
  CurriculumEnrollment,
  CurriculumEnrollmentQueryParams,
  CurriculumEnrollmentSliceParams
} from '@/features/enrollment/types/enrollment.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const curriculumEnrollmentApi = createCrudApi<CurriculumEnrollment, CurriculumEnrollmentQueryParams>({
  reducerPath: 'curriculumEnrollmentApi',
  tagTypes: ['CurriculumEnrollment'],
  baseUrl: '/curriculum-enrollments'
})

export const {
  useGetByIdQuery: useGetCurriculumEnrollmentByIdQuery,
  useSearchQuery: useSearchCurriculumEnrollmentQuery,
  useGetAllQuery: useGetAllCurriculumEnrollmentQuery,
  useCreateMutation: useCreateCurriculumEnrollmentMutation,
  useUpdateMutation: useUpdateCurriculumEnrollmentMutation,
  useDeleteMutation: useDeleteCurriculumEnrollmentMutation,

  // lazy
  useLazyGetByIdQuery: useLazyGetCurriculumEnrollmentByIdQuery,
  useLazySearchQuery: useLazySearchCurriculumEnrollmentQuery,
  useLazyGetAllQuery: useLazyGetAllCurriculumEnrollmentQuery
} = curriculumEnrollmentApi
