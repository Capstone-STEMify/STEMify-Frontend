import {
  Classroom,
  ClassroomSchedule,
  ClassroomSliceParams,
  StudentProgressData,
  StudentProgressParams
} from '@/features/classroom/types/classroom.type'
import { createCrudApi, customFetchBaseQueryWithErrorHandling } from '@/libs/redux/baseApi'
import { RootState } from '@/libs/redux/store'
import { ApiSuccessResponse } from '@/types/baseModel'

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
    deleteClassroomStudents: builder.mutation<void, { classroomId: number; studentIds: string[] }>({
      query: ({ classroomId, studentIds }) => ({
        url: `/classrooms/${classroomId}/classroom-students/bulk`,
        method: 'DELETE',
        body: { studentIds }
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
    }),

    getClassroomStudentProgress: builder.query<ApiSuccessResponse<StudentProgressData>, StudentProgressParams>({
      query: ({ classroomId, courseId }) => ({
        url: `/classrooms/${classroomId}/student-progress`,
        method: 'GET',
        params: { courseId }
      }),
      providesTags: ['Classroom']
    }),
    getClassroomSchedule: builder.query<ApiSuccessResponse<ClassroomSchedule>, { classroomId: number }>({
      query: ({ classroomId }) => ({
        url: `/classrooms/${classroomId}/schedule`
      })
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

  useGetClassroomScheduleQuery,

  useUpdateClassroomCurriculumMutation,
  useUpdateTeacherClassroomMutation,

  useAddClassroomStudentsMutation,
  useDeleteClassroomStudentsMutation,

  useGetClassroomStudentProgressQuery
} = classroomApi
