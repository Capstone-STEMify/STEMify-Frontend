export type Organization = {
  id: number
  name: string
  description?: string
  imageUrl?: string
  organizationType: string
  createdAt: string
  updatedAt: string
  status: OrganizationStatus
}

export type AdminOrganization = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export enum OrganizationStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}
