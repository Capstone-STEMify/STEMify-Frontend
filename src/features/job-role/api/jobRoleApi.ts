import { JobRole, JobRoleQueryParams } from '@/features/job-role/types/jobRole.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const jobRoleApi = createCrudApi<JobRole, JobRoleQueryParams>({
  reducerPath: 'jobRoleApi',
  tagTypes: ['JobRole'],
  baseUrl: '/job-roles'
})

export const {
  // queries
  useGetAllQuery: useGetAllJobRoleQuery,

  // mutations
  useCreateMutation: useCreateJobRoleMutation
} = jobRoleApi
