import { JobRole } from '@/features/contact/types/contact.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export const jobRoleApi = createCrudApi<JobRole, SearchPaginatedRequestParams>({
  reducerPath: 'jobRoleApi',
  tagTypes: ['JobRole'],
  baseUrl: '/job-roles'
})

export const {
  // queries
  useGetAllQuery: useGetAllJobRolesQuery
} = jobRoleApi
