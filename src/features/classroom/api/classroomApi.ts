import {
  Classroom,
  ClassroomSchedule,
  ClassroomSliceParams,
  ClassroomStatisticData,
  StudentClassroomParams,
  StudentDetailResponse,
  CreateClassroom,
  StudentProgressData,
  StudentProgressParams,
  AiAnalysisResponse,
  AiAnalysisRequest
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
    updateClassroomCourse: builder.mutation<any, { classroomId: number; courseId: number }>({
      query: ({ classroomId, courseId }) => ({
        url: `/classrooms/${classroomId}`,
        method: 'PATCH',
        body: { courseId }
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
    }),
    getClassroomStatistics: builder.query<ApiSuccessResponse<ClassroomStatisticData>, { classroomId: number }>({
      query: ({ classroomId }) => ({
        url: `/classrooms/${classroomId}/statistic`
      })
    }),
    getClassroomStudentDetail: builder.query<ApiSuccessResponse<StudentDetailResponse>, StudentClassroomParams>({
      query: ({classroomId, studentId}) => ({
        url: `/classrooms/${classroomId}/classroom-students/${studentId}`
      })
    }),
    createClassroom: builder.mutation<ApiSuccessResponse<Classroom>, Partial<CreateClassroom>>({
      query: (body) => ({
        url: `/classrooms`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Classroom']
    }),
    analyzeClassroomProgress: builder.mutation<ApiSuccessResponse<AiAnalysisResponse>, AiAnalysisRequest>({
      query: (body) => ({
        url: `/ai/recommendations/analyze-progress`,
        method: 'POST',
        body
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
  // useCreateMutation: useCreateClassroomMutation,

  useCreateClassroomMutation,

  useGetClassroomScheduleQuery,

  useUpdateClassroomCourseMutation,
  useUpdateTeacherClassroomMutation,

  useAddClassroomStudentsMutation,
  useDeleteClassroomStudentsMutation,

  useGetClassroomStudentProgressQuery,
  useGetClassroomStatisticsQuery,

  useGetClassroomStudentDetailQuery,

  useAnalyzeClassroomProgressMutation
} = classroomApi
