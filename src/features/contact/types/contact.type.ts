import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Contact = {
  id: number
  firstName: string
  lastName: string
  emailAddress: string
  phoneNumber: string
  organizationName: string
  organizationType: string
  createdAt: string
  updatedAt: string
  jobRoleName: string
  status: ContactStatus
}

export enum ContactStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  RESOLVED = 'Resolved',
  SPAM = 'Spam'
}

export type ContactSliceParams = {} & SliceQueryParams

export type ContactQueryParams = {} & SearchPaginatedRequestParams
