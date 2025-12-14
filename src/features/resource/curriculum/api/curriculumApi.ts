import { Curriculum, CurriculumSliceParams } from '@/features/resource/curriculum/types/curriculum.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const curriculumApi = createCrudApi<Curriculum, CurriculumSliceParams>({
  reducerPath: 'curriculumApi',
  tagTypes: ['Curriculum', 'Course', 'Product'],
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
    }),

    updateCourseOrder: builder.mutation<Curriculum, { curriculumId: number; orderedCourseIds: number[] }>({
      query: ({ curriculumId, orderedCourseIds }) => ({
        url: `/curriculums/${curriculumId}/courses`,
        method: 'PATCH',
        body: {
          orderedCourseIds
        }
      }),
      invalidatesTags: (result, error, { curriculumId }) => [
        { type: 'Curriculum', id: curriculumId },
        'Curriculum',
        'Course'
      ]
    }),
    addEmulationToCurriculum: builder.mutation<Curriculum, { curriculumId: number; emulationIds: string[] }>({
      query: ({ curriculumId, emulationIds }) => ({
        url: `/curriculums/${curriculumId}/emulations`,
        method: 'POST',
        body: {
          emulationIds
        }
      }),
      invalidatesTags: (result, error, { curriculumId }) => [
        { type: 'Curriculum', id: curriculumId },
        'Curriculum',
        'Course'
      ]
    }),
    deleteEmulationFromCurriculum: builder.mutation<Curriculum, { curriculumId: number; emulationIds: string[] }>({
      query: ({ curriculumId, emulationIds }) => ({
        url: `/curriculums/${curriculumId}/emulations`,
        method: 'DELETE',
        body: {
          emulationIds
        }
      }),
      invalidatesTags: (result, error, { curriculumId }) => [{ type: 'Curriculum', id: curriculumId }, 'Curriculum']
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
  useDeleteCourseFromCurriculumMutation,
  useUpdateCourseOrderMutation,

  // curriculum emulations
  useAddEmulationToCurriculumMutation,
  useDeleteEmulationFromCurriculumMutation
} = curriculumApi
