import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type JobRole = {
  id: number
  name: string
}
export type JobRoleQueryParams = {} & SearchPaginatedRequestParams
