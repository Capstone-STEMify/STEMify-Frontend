import { Classroom } from '@/features/classroom/types/classroom'
import { injectCrudEndpoints } from '@/libs/redux/injectCrudEndpoints'
import { SearchPaginatedRequestParams } from '@/types/baseModel'
import { ClassroomStatus } from '@/types/enum'

export type ClassroomParams = {
  teacherId?: string
  status?: ClassroomStatus
} & SearchPaginatedRequestParams

export const classroomApi = injectCrudEndpoints<Classroom, ClassroomParams>({
  tagType: 'Classroom',
  baseUrl: '/classrooms'
  // searchUrl: '/classrooms'
})

export const {
  useSearchQuery: useSearchClassroomQuery,
  useGetByIdQuery: useGetClassroomByIdQuery,
  useGetAllQuery: useGetAllClassroomQuery,
  useCreateMutation: useCreateClassroomMutation,
  useUpdateMutation: useUpdateClassroomMutation,
  useDeleteMutation: useDeleteClassroomMutation,

  // lazy
  useLazySearchQuery: useLazySearchClassroomQuery,
  useLazyGetAllQuery: useLazyGetAllClassroomQuery,
  useLazyGetByIdQuery: useLazyGetClassroomByIdQuery
} = classroomApi
