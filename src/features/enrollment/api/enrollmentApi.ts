import { Enrollment, EnrollmentQueryParams } from '@/features/enrollment/types/enrollment.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const enrollmentApi = createCrudApi<Enrollment, EnrollmentQueryParams>({
  reducerPath: 'enrollmentApi',
  tagType: 'Enrollment',
  baseUrl: '/enrollments'
})

export const {
  useGetByIdQuery: useGetEnrollmentByIdQuery,
  useSearchQuery: useSearchEnrollmentQuery,
  useGetAllQuery: useGetAllEnrollmentQuery,
  useCreateMutation: useCreateEnrollmentMutaion,
  useUpdateMutation: useUpdateEnrollmentMutation,
  useDeleteMutation: useDeleteEnrollmentMutation,

  // lazy
  useLazyGetByIdQuery: useLazyGetEnrollmentByIdQuery,
  useLazySearchQuery: useLazySearchEnrollmentQuery,
  useLazyGetAllQuery: useLazyGetAllEnrollmentQuery
} = enrollmentApi
