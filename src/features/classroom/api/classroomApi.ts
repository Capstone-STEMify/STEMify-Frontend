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

  useAddClassroomStudentsMutation,
  useDeleteClassroomStudentsMutation
} = classroomApi
