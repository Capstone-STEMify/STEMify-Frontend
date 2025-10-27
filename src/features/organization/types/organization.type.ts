export type Organization = {
  id: number
  name: string
  organizationType: string
  description: string
  imageUrl?: string
  status: OrganizationStatus
  createdAt: string
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
