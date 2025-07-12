import { createCrudApi } from '@/libs/redux/baseApi'
import { Course, CourseParams } from '../types/course.type'

export const courseApi = createCrudApi<Course, CourseParams>({
  reducerPath: 'courseApi',
  tagType: 'Course',
  baseUrl: '/courses'

  // searchUrl: '/courses/search'
})

// export const courseApiExtended = courseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     createCourseWithFormData: builder.mutation<Course, FormData>({
//       query: (formData) => ({
//         url: '/courses',
//         method: 'POST',
//         body: formData
//       }),
//       invalidatesTags: ['Course']
//     })
//   })
// })

export const {
  useSearchQuery: useSearchCourseQuery,
  useGetByIdQuery: useGetCourseByIdQuery,
  useGetAllQuery: useGetAllCourseQuery,
  useCreateMutation: useCreateCourseMutation,
  useCreateFormDataMutation: useCreateCourseWithFormDataMutation,
  useUpdateMutation: useUpdateCourseMutation,
  useUpdateFormDataMutation: useUpdateCourseWithFormDataMutation,
  useDeleteMutation: useDeleteCourseMutation,

  // lazy
  useLazySearchQuery: useLazySearchCourseQuery,
  useLazyGetAllQuery: useLazyGetAllCourseQuery,
  useLazyGetByIdQuery: useLazyGetCourseByIdQuery
} = courseApi

// export const { useCreateCourseWithFormDataMutation } = courseApiExtended
