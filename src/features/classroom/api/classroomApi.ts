import { Classroom, ClassroomSchedule, ClassroomSliceParams } from '@/features/classroom/types/classroom.type'
import { createCrudApi, customFetchBaseQueryWithErrorHandling } from '@/libs/redux/baseApi'
import { RootState } from '@/libs/redux/store'
import { ApiSuccessResponse } from '@/types/baseModel'

export const classroomApi = createCrudApi<Classroom, ClassroomSliceParams>({
  reducerPath: 'classroomApi',
  baseUrl: '/classrooms',
  tagTypes: ['Classroom'],
  baseQuery: async (args, api, extra) => {
    const activeOrg = (api.getState() as RootState).selectedOrganization.selectedOrganizationId
    const activeSub = (api.getState() as RootState).selectedOrganization.selectedSubscriptionOrderId

    let headers: Record<string, string> = {}
    if (activeOrg) headers['X-Active-Organization'] = String(activeOrg)
    if (activeSub) headers['X-Active-Subscription'] = String(activeSub)

    // gọi baseQuery gốc
    return customFetchBaseQueryWithErrorHandling(
      {
        ...(typeof args === 'string' ? { url: args } : args),
        headers: { ...headers, ...(typeof args === 'string' ? {} : args.headers) }
      },
      api,
      extra
    )
  }
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
  useDeleteClassroomStudentsMutation
} = classroomApi
