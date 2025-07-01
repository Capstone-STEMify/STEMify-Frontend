import { Enrollment, EnrollmentQueryParams } from '@/features/my-learning/types/enrollment.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const enrollmentApi = createCrudApi<Enrollment, EnrollmentQueryParams>({
  reducerPath: 'enrollmentApi',
  tagType: 'Enrollment',
  baseUrl: '/enrollments'
})

export const {
  useSearchQuery: useSearchEnrollmentQuery,
  useGetAllQuery: useGetAllEnrollmentQuery,
  useCreateMutation: useCreateEnrollmentMutaion
} = enrollmentApi
