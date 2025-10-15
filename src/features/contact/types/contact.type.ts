export type ContactRequest = {
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
  status: ContactRequestStatus
}

export enum ContactRequestStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  RESOLVED = 'Resolved',
  SPAM = 'Spam'
}
