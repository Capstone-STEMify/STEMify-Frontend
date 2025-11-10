import { Classroom, ClassroomSliceParams } from '@/features/classroom/types/classroom.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const classroomApi = createCrudApi<Classroom, ClassroomSliceParams>({
  reducerPath: 'classroomApi',
  baseUrl: '/classrooms',
  tagTypes: ['Classroom']
}).injectEndpoints({
  endpoints: (builder) => ({
    addClassroomStudents: builder.mutation<void, { classroomId: number; studentEmails: string[] }>({
      query: ({ classroomId, studentEmails }) => ({
        url: `/classrooms/${classroomId}/classroom-students/bulk`,
        method: 'POST',
        body: { studentEmails }
      }),
      invalidatesTags: ['Classroom']
    }),
    deleteClassroomStudents: builder.mutation<void, { classroomId: number; studentEmails: string[] }>({
      query: ({ classroomId, studentEmails }) => ({
        url: `/classrooms/${classroomId}/classroom-students/bulk`,
        method: 'DELETE',
        body: { studentEmails }
      }),
      invalidatesTags: ['Classroom']
    }),

    // PATCH: classrooms/1/curriculum
    updateClassroomCurriculum: builder.mutation<any, { classroomId: number; curriculumId: number }>({
      query: ({ classroomId, curriculumId }) => ({
        url: `/classrooms/${classroomId}`,
        method: 'PATCH',
        body: { curriculumId }
      }),
      invalidatesTags: ['Classroom']
    }),

    updateTeacherClassroom: builder.mutation<any, { classroomId: number; teacherId: string }>({
      query: ({ classroomId, teacherId }) => ({
        url: `/classrooms/${classroomId}`,
        method: 'PATCH',
        body: { teacherId }
      }),
      invalidatesTags: ['Classroom']
    })
  })
})

export const {
  useSearchQuery: useSearchClassroomsQuery,
  useGetAllQuery: useGetAllClassroomsQuery,
  useGetByIdQuery: useGetClassroomByIdQuery,
  useUpdateMutation: useUpdateClassroomMutation,
  useDeleteMutation: useDeleteClassroomMutation,
  useCreateMutation: useCreateClassroomMutation,

  useUpdateClassroomCurriculumMutation,
  useUpdateTeacherClassroomMutation,

  useAddClassroomStudentsMutation,
  useDeleteClassroomStudentsMutation
} = classroomApi
