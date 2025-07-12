import { enrollmentApi } from '@/features/enrollment/api/enrollmentApi'
import { LessonProgress, SectionProgress } from '@/features/student-progress/types/studentProgress.type'

export const studentProgresssApi = enrollmentApi.injectEndpoints({
  endpoints: (build) => ({
    getLessonProgress: build.query<LessonProgress, number>({
      query: (enrollmenId) => ({
        url: `/enrollments/${enrollmenId}/lesson-progress/`,
        method: 'GET'
      }),
      providesTags: (result, error, lessonId) => [{ type: 'LessonProgress', id: lessonId }]
    }),

    startLesson: build.mutation<LessonProgress, { enrollmentId: number; lessonId: number }>({
      query: ({ enrollmentId, lessonId }) => ({
        url: `/enrollments/${enrollmentId}/lesson-progress/${lessonId}/`,
        method: 'PATCH'
      }),
      invalidatesTags: (result, error, { enrollmentId, lessonId }) => [
        { type: 'LessonProgress', id: lessonId },
        { type: 'Enrollment', id: enrollmentId }
      ]
    }),

    getSectionProgress: build.query<SectionProgress[], { enrollmentId: number; lessonId: number }>({
      query: ({ enrollmentId, lessonId }) => ({
        url: `/enrollments/${enrollmentId}/lesson-progress/${lessonId}/section-progress`,
        method: 'GET'
      }),
      providesTags: (result, error, { enrollmentId, lessonId }) => [
        { type: 'LessonProgress', id: lessonId },
        { type: 'Enrollment', id: enrollmentId }
      ]
    }),

    completeSection: build.mutation<SectionProgress, { enrollmentId: number; lessonId: number; sectionId: number }>({
      query: ({ enrollmentId, lessonId, sectionId }) => ({
        url: `/enrollments/${enrollmentId}/lesson-progress/${lessonId}/section-progress/${sectionId}`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, { enrollmentId, lessonId }) => [
        { type: 'LessonProgress', id: lessonId },
        { type: 'Enrollment', id: enrollmentId }
      ]
    })
  })
})

export const {
  // lesson progress
  useGetLessonProgressQuery,
  useStartLessonMutation,

  // section progress
  useGetSectionProgressQuery,
  useCompleteSectionMutation
} = studentProgresssApi
