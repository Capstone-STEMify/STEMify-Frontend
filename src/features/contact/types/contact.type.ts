import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Contact = {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  organizationName: string
  createdAt: string
  updatedAt: string
  jobRoleId: number
  jobRole: string
  status: ContactStatus
}

export enum ContactStatus {
  NEW = 'New',
  IN_PROGRESS = 'InProgress',
  RESOLVED = 'Resolved',
  SPAM = 'Spam'
}

export type JobRole = {
  id: number
  name: string
}

export type ContactSliceParams = {} & SliceQueryParams

export type ContactQueryParams = {} & SearchPaginatedRequestParams
