import { Classroom } from '@/features/classroom/types/classroom.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type ClassroomParams = {
  teacherId?: string
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
