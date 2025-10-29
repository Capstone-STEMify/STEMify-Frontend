import { Classroom, ClassroomQueryParams } from '@/features/classroom/types/classroom.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const classroomApi = createCrudApi<Classroom, ClassroomQueryParams>({
  reducerPath: 'classroomApi',
  baseUrl: '/classrooms',
  tagTypes: ['Classroom']
})

export const {
  useSearchQuery: useSearchClassroomsQuery,
  useGetAllQuery: useGetAllClassroomsQuery,
  useGetByIdQuery: useGetClassroomByIdQuery,
  useUpdateMutation: useUpdateClassroomMutation,
  useDeleteMutation: useDeleteClassroomMutation,
  useCreateMutation: useCreateClassroomMutation
} = classroomApi
