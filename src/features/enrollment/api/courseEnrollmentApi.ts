import {
  CourseEnrollment,
  CourseEnrollmentQueryParams,
  CourseEnrollmentSliceParams
} from '@/features/enrollment/types/enrollment.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const courseEnrollmentApi = createCrudApi<CourseEnrollment, CourseEnrollmentQueryParams>({
  reducerPath: 'courseEnrollmentApi',
  tagTypes: ['CourseEnrollment'],
  baseUrl: '/course-enrollments'
})

export const {
  useGetByIdQuery: useGetCourseEnrollmentByIdQuery,
  useSearchQuery: useSearchCourseEnrollmentQuery,
  useGetAllQuery: useGetAllCourseEnrollmentQuery,
  useCreateMutation: useCreateCourseEnrollmentMutation,
  useUpdateMutation: useUpdateCourseEnrollmentMutation,
  useDeleteMutation: useDeleteCourseEnrollmentMutation,

  // lazy
  useLazyGetByIdQuery: useLazyGetCourseEnrollmentByIdQuery,
  useLazySearchQuery: useLazySearchCourseEnrollmentQuery,
  useLazyGetAllQuery: useLazyGetAllCourseEnrollmentQuery
} = courseEnrollmentApi
