import { createCrudApi } from '@/libs/redux/baseApi'
import { Curriculum, CurriculumQueryParams } from '../types/curriculum.type'

export const curriculumApi = createCrudApi<Curriculum, CurriculumQueryParams>({
  reducerPath: 'curriculumApi',
  tagTypes: ['Curriculum', 'Course'],
  baseUrl: '/curriculums'
}).injectEndpoints({
  endpoints: (builder) => ({
    addCourseToCurriculum: builder.mutation<Curriculum, { curriculumId: number; courseIds: number[] }>({
      query: ({ curriculumId, courseIds }) => ({
        url: `/curriculums/${curriculumId}/courses`,
        method: 'POST',
        body: {
          courseIds
        }
      }),
      invalidatesTags: (result, error, { curriculumId }) => [
        { type: 'Curriculum', id: curriculumId },
        'Curriculum',
        'Course'
      ]
    }),

    deleteCourseFromCurriculum: builder.mutation<Curriculum, { curriculumId: number; courseIds: number[] }>({
      query: ({ curriculumId, courseIds }) => ({
        url: `/curriculums/${curriculumId}/courses`,
        method: 'DELETE',
        body: {
          courseIds
        }
      }),
      invalidatesTags: (result, error, { curriculumId }) => [
        { type: 'Curriculum', id: curriculumId },
        'Curriculum',
        'Course'
      ]
    })
  })
})

export const {
  useSearchQuery: useSearchCurriculumQuery,
  useGetByIdQuery: useGetCurriculumByIdQuery,
  useGetAllQuery: useGetAllCurriculumQuery,
  useCreateMutation: useCreateCurriculumMutation,
  useUpdateMutation: useUpdateCurriculumMutation,
  useDeleteMutation: useDeleteCurriculumMutation,

  // lazy
  useLazySearchQuery: useLazySearchCurriculumQuery,
  useLazyGetAllQuery: useLazyGetAllCurriculumQuery,
  useLazyGetByIdQuery: useLazyGetCurriculumByIdQuery,

  // curriculum courses
  useAddCourseToCurriculumMutation,
  useDeleteCourseFromCurriculumMutation
} = curriculumApi
