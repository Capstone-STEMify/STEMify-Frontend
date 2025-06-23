import { Classroom } from '@/features/classroom/types/classroom'
import { createCrudApi } from '@/libs/redux/baseApi'
import { SearchPaginatedRequestParams } from '@/types/baseModel'
import { ClassroomStatus } from '@/types/enum'

export type ClassroomParams = {
  teacherId?: string
  status?: ClassroomStatus
} & SearchPaginatedRequestParams

export const classroomApi = createCrudApi<Classroom, ClassroomParams>({
  reducerPath: 'classroomApi',
  tagType: 'Classroom',
  baseUrl: '/classrooms'
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
