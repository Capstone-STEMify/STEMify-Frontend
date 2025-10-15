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

export enum OrganizationStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}
